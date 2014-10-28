
var fs = require('fs');

var Generator = require('jsbison');

Generator.lexParser.parse(fs.readFileSync('./json.l').toString());


Generator.bnfParser.parse(fs.readFileSync('./json.y').toString());

var bnfcfg = Generator.bnfParser.$$;
bnfcfg.lex = Generator.lexParser.$$;
bnfcfg.type = 'LR(1)';


debugger
var generator = new Generator(bnfcfg);

var code = generator.generate();


fs.writeFileSync('./parser.js', code);
