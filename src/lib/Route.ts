import type { Path, Point } from '$types/Path';

import { DegToRad, RadToDeg } from './Math';

const MARGIN_METER = 30;

type RouteElementToDraw =
	| { type: 'move'; x: number; y: number }
	| { type: 'line'; x: number; y: number }
	| {
			type: 'arc';
			cx: number;
			cy: number;
			radius: number;
			startAngleRad: number;
			endAngleRad: number;
			anticlockwise: boolean;
	  };

export class Route {
	private boundingBoxCache: { minX: number; minY: number; maxX: number; maxY: number };
	private pathLengthCache: number;
	private pathPointsCache: Point[] = [];
	private elementsToDrawCache: RouteElementToDraw[];

	constructor(
		public startPoint: Point,
		public path: Path
	) {
		this.pathLengthCache = Math.trunc(this.calcTotalPathLength());
		for (let d = 0; d < this.pathLengthCache; d++)
			this.pathPointsCache.push(this.calcPositionOnPath(d));
		this.boundingBoxCache = this.calculateBoundingBox();
		this.elementsToDrawCache = this.getPathElementsToDraw();
	}

	// public
	public get pathLength() {
		return this.pathLengthCache;
	}

	public getPathPoint(distance: number): Point {
		return this.pathPointsCache[Math.trunc(distance % this.pathLengthCache)];
	}

	public get box() {
		return {
			offsetX: -MARGIN_METER + this.boundingBoxCache.minX,
			offsetY: -MARGIN_METER + this.boundingBoxCache.minY,
			width: this.boundingBoxCache.maxX - this.boundingBoxCache.minX + 2 * MARGIN_METER,
			height: this.boundingBoxCache.maxY - this.boundingBoxCache.minY + 2 * MARGIN_METER
		};
	}

	public get elementToDraw() {
		return this.elementsToDrawCache;
	}

	// private calc
	private calcTotalPathLength = (): number =>
		this.path.reduce(
			(sum, seg) =>
				sum + (seg.type === 'line' ? seg.length : Math.abs(seg.radius * DegToRad(seg.angle))),
			0
		);

	private calcPositionOnPath(distance: number): Point {
		let remainingDistance = distance % this.calcTotalPathLength();
		let x = this.startPoint.x,
			y = this.startPoint.y,
			angle = this.startPoint.angle;

		while (remainingDistance > 0) {
			for (const segment of this.path) {
				if (segment.type === 'line') {
					if (remainingDistance <= segment.length) {
						x += remainingDistance * Math.cos(DegToRad(angle));
						y += remainingDistance * Math.sin(DegToRad(angle));
						return { x, y, angle };
					}
					x += segment.length * Math.cos(DegToRad(angle));
					y += segment.length * Math.sin(DegToRad(angle));
					remainingDistance -= segment.length;
				} else if (segment.type === 'arc') {
					const arcLength = Math.abs(segment.radius * DegToRad(segment.angle));
					const anticlockwise = segment.angle < 0;
					const thetaRad = remainingDistance / segment.radius;
					const thetaDeg = RadToDeg(thetaRad);

					const cx = x - segment.radius * Math.sin(DegToRad(angle)) * (anticlockwise ? -1 : 1);
					const cy = y + segment.radius * Math.cos(DegToRad(angle)) * (anticlockwise ? -1 : 1);

					if (remainingDistance <= arcLength) {
						angle += thetaDeg * Math.sign(segment.angle);
						x = cx + segment.radius * Math.cos(DegToRad(angle - 90 * (anticlockwise ? -1 : 1)));
						y = cy + segment.radius * Math.sin(DegToRad(angle - 90 * (anticlockwise ? -1 : 1)));
						return { x, y, angle };
					}

					angle += segment.angle;
					x = cx + segment.radius * Math.cos(DegToRad(angle - 90 * (anticlockwise ? -1 : 1)));
					y = cy + segment.radius * Math.sin(DegToRad(angle - 90 * (anticlockwise ? -1 : 1)));
					remainingDistance -= arcLength;
				}
			}
		}
		return { x, y, angle };
	}

	private calculateBoundingBox() {
		let minX = this.startPoint.x,
			minY = this.startPoint.y,
			maxX = this.startPoint.x,
			maxY = this.startPoint.y;

		for (let d = 0; d < this.pathLengthCache; d++) {
			const pos = this.calcPositionOnPath(d);
			minX = Math.trunc(Math.min(minX, pos.x));
			minY = Math.trunc(Math.min(minY, pos.y));
			maxX = Math.trunc(Math.max(maxX, pos.x));
			maxY = Math.trunc(Math.max(maxY, pos.y));
		}
		return { minX, minY, maxX, maxY };
	}

	private getPathElementsToDraw(): RouteElementToDraw[] {
		const elements: RouteElementToDraw[] = [];
		elements.push({ type: 'move', x: this.startPoint.x, y: this.startPoint.y });

		let x = this.startPoint.x,
			y = this.startPoint.y,
			angle = this.startPoint.angle;

		for (const segment of this.path) {
			if (segment.type === 'line') {
				const endX = x + segment.length * Math.cos(DegToRad(angle));
				const endY = y + segment.length * Math.sin(DegToRad(angle));

				elements.push({ type: 'line', x: endX, y: endY });

				x = endX;
				y = endY;
			} else if (segment.type === 'arc') {
				const anticlockwise = segment.angle < 0;
				const cx = x - segment.radius * Math.sin(DegToRad(angle)) * (anticlockwise ? -1 : 1);
				const cy = y + segment.radius * Math.cos(DegToRad(angle)) * (anticlockwise ? -1 : 1);

				const startAngleRad = DegToRad(angle - 90 * (anticlockwise ? -1 : 1));
				const endAngleRad = DegToRad(angle - 90 * (anticlockwise ? -1 : 1) + segment.angle);

				elements.push({
					type: 'arc',
					cx,
					cy,
					radius: segment.radius,
					startAngleRad,
					endAngleRad,
					anticlockwise
				});

				x = cx + segment.radius * Math.cos(endAngleRad);
				y = cy + segment.radius * Math.sin(endAngleRad);
				angle += segment.angle;
			}
		}
		return elements;
	}
}
