import antlr4 from "antlr4";
import analizadorLexer from "./generated/analizadorLexer.js";
import analizadorParser from "./generated/analizadorParser.js";
import CustomanalizadorVisitor from "./CustomanalizadorVisitor.js";
import readline from "readline";
import fs from "fs";

async function main() {
  let input;

  // Intentar leer desde archivo
  try {
    input = fs.readFileSync("input.txt", "utf8");
  } catch (err) {
    input = await leerCadena();
    console.log(input);
  }

  // Paso 1: Lexer
  let inputStream = antlr4.CharStreams.fromString(input);
  let lexer = new analizadorLexer(inputStream);
  let tokens = lexer.getAllTokens();

  if (tokens.length === 0) {
    console.error(" No se generaron tokens. Verifica la entrada y la gramática.");
    return;
  }

  // Tabla de tokens
  console.log("\n Tabla de Tokens y Lexemas:");
  console.log("-----------------------------------------------");
  console.log("| Lexema          | Token                     |");
  console.log("-----------------------------------------------");
  for (let token of tokens) {
    const tokenType = analizadorLexer.symbolicNames[token.type] || `UNKNOWN(${token.type})`;
    const lexema = token.text;
    console.log(`| ${lexema.padEnd(15)} | ${tokenType.padEnd(25)} |`);
  }
  console.log("-----------------------------------------------");

  // Paso 2: Parser
  inputStream = antlr4.CharStreams.fromString(input);
  lexer = new analizadorLexer(inputStream);
  let tokenStream = new antlr4.CommonTokenStream(lexer);
  let parser = new analizadorParser(tokenStream);
  parser.buildParseTrees = true;

  const tree = parser.programa();

  if (parser._syntaxErrors > 0) {
    console.error(" Se encontraron errores de sintaxis.");
  } else {
    console.log("Entrada válida.");
    const cadena_tree = tree.toStringTree(parser.ruleNames);
    console.log(" Árbol de derivación:", cadena_tree);

    const visitor = new CustomanalizadorVisitor();
    visitor.visit(tree);
  }
}

function leerCadena() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Ingrese una cadena: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

main();
