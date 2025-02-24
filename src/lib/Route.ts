import type { RoutePath, RoutePoint, RouteStartPoint } from '$types/RouteTypes';

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
	private pathPointsCache: RoutePoint[] = [];
	private elementsToDrawCache: RouteElementToDraw[];

	constructor(
		public startPoint: RouteStartPoint,
		public path: RoutePath[]
	) {
		this.pathLengthCache = Math.trunc(this.calcTotalPathLength());

		for (let d = 0; d < this.pathLengthCache; d++)
			this.pathPointsCache.push(this.calcPositionOnPath(d));

		for (let d = 0; d < this.pathLengthCache; d++) {
			for (let n = d + 1; n < this.pathLengthCache * 2; n++) {
				const nPoint = this.pathPointsCache[(n + this.pathLengthCache) % this.pathLengthCache];
				const dPoint = this.pathPointsCache[d];
				if (nPoint.radius != 0 && (dPoint.radius === 0 || nPoint.radius < dPoint.radius)) {
					dPoint.nextCurveCw = { distance: Math.abs(n - d), radius: nPoint.radius };
					break;
				}
			}
			for (let n = 0; n < this.pathLengthCache; n++) {
				const nPoint = this.pathPointsCache[(d - n + this.pathLengthCache) % this.pathLengthCache];
				const dPoint = this.pathPointsCache[d];
				if (nPoint.radius != 0 && (dPoint.radius === 0 || nPoint.radius < dPoint.radius)) {
					dPoint.nextCurveCcw = { distance: Math.abs(n), radius: nPoint.radius };
					break;
				}
			}
		}

		this.boundingBoxCache = this.calculateBoundingBox();

		this.elementsToDrawCache = this.getPathElementsToDraw();
	}

	// public
	public get pathLength() {
		return this.pathLengthCache;
	}

	public getPathPoint(distance: number): RoutePoint {
		while (distance < 0) distance += this.pathLengthCache;
		const index = Math.trunc((distance + this.pathLengthCache) % this.pathLengthCache);
		return this.pathPointsCache[index];
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

	private calcPositionOnPath(distance: number): RoutePoint {
		let remainingDistance = distance % this.calcTotalPathLength();
		let x = this.startPoint.x,
			y = this.startPoint.y,
			angle = this.startPoint.angle,
			radius = 0;

		while (remainingDistance > 0) {
			for (const segment of this.path) {
				if (segment.type === 'line') {
					if (remainingDistance <= segment.length) {
						x += remainingDistance * Math.cos(DegToRad(angle));
						y += remainingDistance * Math.sin(DegToRad(angle));
						return { x, y, angle, radius: 0, nextCurveCw: undefined, nextCurveCcw: undefined };
					}
					x += segment.length * Math.cos(DegToRad(angle));
					y += segment.length * Math.sin(DegToRad(angle));
					remainingDistance -= segment.length;
					radius = 0;
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
						return {
							x,
							y,
							angle,
							radius: segment.radius,
							nextCurveCw: undefined,
							nextCurveCcw: undefined
						};
					}

					angle += segment.angle;
					x = cx + segment.radius * Math.cos(DegToRad(angle - 90 * (anticlockwise ? -1 : 1)));
					y = cy + segment.radius * Math.sin(DegToRad(angle - 90 * (anticlockwise ? -1 : 1)));
					remainingDistance -= arcLength;
					radius = segment.radius;
				}
			}
		}
		return { x, y, angle, radius, nextCurveCw: undefined, nextCurveCcw: undefined };
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
				elements.push({ type: 'move', x, y });
			}
		}
		return elements;
	}
}
