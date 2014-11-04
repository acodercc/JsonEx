
var fs = require('fs');

var Generator = require('jsbison');

Generator.lexParser.parse(fs.readFileSync('./json.l').toString());


Generator.bnfParser.parse(fs.readFileSync('./json.y').toString());
console.log(JSON.stringify(Generator.bnfParser.$$,null, ' '));

var bnfcfg = Generator.bnfParser.$$;
bnfcfg.lex = Generator.lexParser.$$;
bnfcfg.type = 'LR(1)';

var start = +new Date;
var generator = new Generator(bnfcfg);
console.log(+new Date - start+'ms');

var code = generator.generate();


fs.writeFileSync('./parser.js', code);
