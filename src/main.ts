import { Application } from "pixi.js";
import {
    GraphicAngle,
    GraphicSquare,
    MathMapWindow,
    MathTools,
    ORectTransform,
    OVector2,
    UpdateService,
} from "math-understanding-tools";

let options = {
    antialias: true,
    autoResize: true,
};

const app = new Application(options);
var mathMapWindow: MathMapWindow = new MathMapWindow(app.stage, 50);
mathMapWindow.rectTransform.pivot.setTo(0.5, 0.5);
mathMapWindow.rectTransform.anchorMin.setTo(0, 0);
mathMapWindow.rectTransform.anchorMax.setTo(1, 1);
var squarePosition: OVector2 = new OVector2();
var square: GraphicSquare = mathMapWindow.map.addSquare(squarePosition, 0.3);
mathMapWindow.map.addVector(OVector2.zero, squarePosition).lineStyle.color = 0xffff00;
mathMapWindow.map.addDistance(OVector2.zero, squarePosition);
var graphicAngle: GraphicAngle = mathMapWindow.map.addAngle(OVector2.zero, 0, 0);
var tmp = mathMapWindow.map.addCoords(squarePosition, OVector2.zero);
square.fillStyle.color = 0x0000dd;
square.fillStyle.alpha = 1;
UpdateService.add(gameloop);
mathMapWindow.map.yAxis.magnitude = mathMapWindow.map.xAxis.magnitude = 1;
tmp.cellSize = 300;
mathMapWindow.map.cellSize = 300;
graphicAngle.radius = 1;

var xAxis = mathMapWindow.map.addVector(OVector2.zero, new OVector2(1, 0));
var yAxis = mathMapWindow.map.addVector(OVector2.zero, new OVector2(0, 1));
var angleText = mathMapWindow.map.addText(new OVector2(1.2, 0.4));
var cosText = mathMapWindow.map.addText(new OVector2(1.2, angleText.position.y + 0.1));
var sinText = mathMapWindow.map.addText(new OVector2(1.2, cosText.position.y + 0.1));
var vectorText = mathMapWindow.map.addText(new OVector2(1.2, sinText.position.y + 0.1));
angleText.pivot.setTo(0, 0);
cosText.pivot.setTo(0, 0);
sinText.pivot.setTo(0, 0);
vectorText.pivot.setTo(0, 0);
mathMapWindow.map.grid.lineStyle.alpha = 0;

vectorText.style.fill = 0xffff00;
cosText.style.fill = xAxis.lineStyle.color = tmp.xColor = 0xff9999;
sinText.style.fill = yAxis.lineStyle.color = tmp.yColor = 0x99ff99;
vectorText.text = "Vector: { \n\tx:Cos(Angle),\n\ty:Sin(Angle)\n}";

let angle = 0;
const ANGLE_SPEED: number = 0.2;

function gameloop(): void {
    angle = (angle + UpdateService.deltaTime * ANGLE_SPEED) % (Math.PI * 2);
    angleText.text = `Angle: ${(angle * MathTools.RAD2DEG).toFixed(2)}°`;
    cosText.text = `Cos(Angle): ${Math.cos(angle).toFixed(2)}`;
    sinText.text = `Sin(Angle): ${Math.sin(angle).toFixed(2)}`;
    graphicAngle.endAngle = angle * MathTools.RAD2DEG;
    xAxis.to.x = Math.cos(angle);
    yAxis.to.y = Math.sin(angle);
    squarePosition.setTo(Math.cos(angle), Math.sin(angle));
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resize);

function init(_: Event): void {
    app.ticker.add((_) => {
        UpdateService.update(app.ticker.deltaMS / 1000);
    });

    document.body.appendChild(app.view);
    resize();
}

function resize(_?: Event): void {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    ORectTransform.rootRectangle.setSize(window.innerWidth, window.innerHeight);
}
