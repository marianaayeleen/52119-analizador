grammar analizador;

// === REGLAS SINTÁCTICAS ===

programa
    : (declaracion | funcion | ejecucion)* EOF
    ;

declaracion
    : 'variable' nombre '=' valor ';'
    ;

funcion
    : 'funcion' nombre '(' argumentos? ')' '{' instrucciones* '}'
    ;

argumentos
    : variable (',' variable)*
    ;

instrucciones
    : operacion_texto
    | impresion
    | retorno
    ;

ejecucion
    : concatenar
    ;

operacion_texto
    : variable '=' transformacion '(' cadena ')' ';'
    ;

transformacion
    : 'mayusculas'
    | 'minusculas'
    | 'longitud'
    | 'invertir'
    | 'reemplazar'
    ;

concatenar
    : variable '=' cadena '+' cadena ';'
    ;

impresion
    : 'imprimir' '(' valor ')' ';'
    ;

retorno
    : 'devolver' valor ';'
    ;

valor
    : texto
    | numero
    | variable
    ;

cadena
    : texto
    | variable
    ;

texto
    : '"' CARACTERES '"'
    ;

nombre
    : IDENTIFICADOR
    ;

variable
    : IDENTIFICADOR
    ;

numero
    : NUMERO
    ;

// === REGLAS LÉXICAS ===

CARACTERES
    : ~["\\\r\n]+
    ;

IDENTIFICADOR
    : [a-zA-Z_][a-zA-Z_0-9]*
    ;

NUMERO
    : [0-9]+
    ;

ESPACIOS
    : [ \t\r\n]+ -> skip
    ;
