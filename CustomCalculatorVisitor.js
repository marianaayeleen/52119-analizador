import analizadorVisitor from "./generated/analizadorVisitor.js";
import analizadorParser from "./generated/analizadorParser.js";

export default class CustomanalizadorVisitor extends analizadorVisitor {

    constructor() {
        super();
        this.memory = new Map(); // para guardar variables
    }

    visitPrograma(ctx) {
        return this.visitChildren(ctx);
    }

    visitFuncion(ctx) {
        const nombre = ctx.ID().getText();
        console.log(`Procesando función: ${nombre}`);
        return this.visit(ctx.bloque());
    }

    visitBloque(ctx) {
        for (let instr of ctx.instruccion()) {
            const resultado = this.visit(instr);
            if (resultado !== undefined) return resultado; // corto si hay return
        }
    }

    visitAsignacion(ctx) {
        const id = ctx.ID().getText();
        const valor = this.visit(ctx.expr());
        this.memory.set(id, valor);
        return valor;
    }

    visitMostrar(ctx) {
        const valor = this.visit(ctx.expr());
        console.log(`Mostrar: ${valor}`);
        return valor;
    }

    visitRetornar(ctx) {
        const valor = this.visit(ctx.expr());
        console.log(`Retornar: ${valor}`);
        return valor;
    }

    visitExprSumaResta(ctx) {
        const izq = this.visit(ctx.expr(0));
        const der = this.visit(ctx.expr(1));

        if (ctx.op.type === analizadorParser.SUMA) return izq + der;
        if (ctx.op.type === analizadorParser.RESTA) return izq - der;
    }

    visitExprMultDiv(ctx) {
        const izq = this.visit(ctx.expr(0));
        const der = this.visit(ctx.expr(1));

        if (ctx.op.type === analizadorParser.MULT) return izq * der;
        if (ctx.op.type === analizadorParser.DIV) return izq / der;
    }

    visitExprParentesis(ctx) {
        return this.visit(ctx.expr());
    }

    visitExprNumero(ctx) {
        return parseFloat(ctx.NUM().getText());
    }

    visitExprId(ctx) {
        const id = ctx.ID().getText();
        if (this.memory.has(id)) return this.memory.get(id);
        console.warn(`Variable '${id}' no definida, se usa 0`);
        return 0;
    }
}
