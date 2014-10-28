(function(global, undef){
if(typeof require === "function"){ _ = require("lodash");}
var parser = {
EOF:"$end",
reset:function (){
            var self = this;
            self.lexer.reset();
        },
lexer: (function(){
return {
CONST:{"INITIAL":"INITIAL","EOF":"$end"},
states:{"exclusive":{}},
rules: [{regex:/^\/\/[^\n]*/,action:'                  /* skip singleline comment */'},{regex:/^\/\*(.|\n|\r)*?\*\//,action:'         /* skip multiline comment */ '},{regex:/^"(?:\\[bfnrt\/"]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,action:'     this.yytext=this.yytext.slice(1, this.yyleng-1);return "STRING";'},{regex:/^\s+/,action:''},{regex:/^\r\n/,action:''},{regex:/^((0|[1-9][0-9]*)(\.[0-9]*)?|\.[0-9]+)([eE][+-]?[0-9]+)?|[0][xX][0-9a-fA-F]+/,action:'   return "NUMBER"'},{regex:/^null/,action:'                        return "NULL";'},{regex:/^true/,action:'                        return "TRUE";'},{regex:/^false/,action:'                       return "FALSE";'},{regex:/^:/,action:'                           return ":";'},{regex:/^,/,action:'                           return ",";'},{regex:/^\[/,action:'                          return "[";'},{regex:/^\]/,action:'                          return "]";'},{regex:/^\{/,action:'                          return "{";'},{regex:/^\}/,action:'                          return "}";'},{regex:/^\s+/,action:'                         /* skip whitespace */'},{regex:/^\n/,action:'                          /* skip lineterminal */'},{regex:/^./,action:'                           return "INVALID";'}],
yymore:function (){
            this._more = true;
        },
stateStack:["INITIAL"],
pushState:function (state){
            this.stateStack.push(state);
        },
popState:function (){
            return this.stateStack.pop();
        },
getCurrentRules:function (){
            var self = this,
            rules = self.rules,
            curState = self.stateStack[self.stateStack.length-1],
            activeRules = [],
            isInclusiveState = true;           //是否为包容状态

            if(self.states.exclusive[curState]){
                isInclusiveState = false;
            }


            for(var i=0, len=rules.length; i<len; i++){

                //处于包容状态时，没有声明状态的规则被激活
                //否则，只有开始条件中包含当前状态的规则被激活
                if((isInclusiveState && (!rules[i].conditions)) || (rules[i].conditions && rules[i].conditions.indexOf(curState) > -1)){
                    activeRules.push(rules[i]);
                }
            }

            return activeRules;
        },
setInput:function (input){
            _.merge(this, {
                input: input,
                position: 0,
                matched: '',
                text: '',
                yytext: '',
                lineno: 1,
                firstline: 1,
                lastline: 1,
                firstcolumn: 1,
                lastcolumn: 1,
                _more: false
            });
        },
getToken:function (isDebug){
            var self = this,
            token = self.getToken_(isDebug);

            if(!token){
                token = self.getToken(isDebug);
            }

            return token;
        },
unToken:function (charsNum){
            this.position -= charsNum;
        },
getToken_:function (isDebug){
            var self = this,
            input = self.input.slice(self.position),
            regex,
            activeRules = self.getCurrentRules(),
            matches;

            if(!input){
                return self.CONST.EOF;
            }

            if(!activeRules.length && isDebug){
                debugger
                //这个断点的原因是，这是编写lex文法时常见的错误，就是自动机陷入一个没有任何规则激活的状态中了
            }

            for(var i=0,len=activeRules.length; i<len; i++){
                regex = activeRules[i].regex;

                if(matches = input.match(activeRules[i].regex)){
                    if(self._more){
                        self.yytext += matches[0];
                    }else{
                        self.yytext = matches[0];
                    }
                    self.position += matches[0].length;
                    self.yyleng = self.yytext.length;
                    self._more = false;
                    return (new Function(activeRules[i].action)).call(self);
                }
            }
            if(isDebug){
                debugger
                //这个断点的原因是，没有在循环体中return 说明当前输入已经无法命中任何规则，自动机将陷入死循环
            }
        },
reset:function (){
            this.setInput(this.input);
        }
};
})(),
lrtable: {"actions":{"0":{"NULL":["shift",3],"STRING":["shift",5],"NUMBER":["shift",6],"TRUE":["shift",9],"FALSE":["shift",10],"{":["shift",11],"[":["shift",12]},"1":{"$end":["shift",13]},"2":{"$end":["shift",14]},"3":{"$end":["reduce",2]},"4":{"$end":["reduce",3]},"5":{"$end":["reduce",4]},"6":{"$end":["reduce",5]},"7":{"$end":["reduce",6]},"8":{"$end":["reduce",7]},"9":{"$end":["reduce",8]},"10":{"$end":["reduce",9]},"11":{"}":["shift",15],"STRING":["shift",18]},"12":{"]":["shift",19],"NULL":["shift",22],"STRING":["shift",24],"NUMBER":["shift",25],"TRUE":["shift",28],"FALSE":["shift",29],"{":["shift",30],"[":["shift",31]},"13":{"$end":["accept",0]},"14":{"$end":["reduce",1]},"15":{"$end":["reduce",10]},"16":{"}":["shift",32],",":["shift",33]},"17":{",":["reduce",13],"}":["reduce",13]},"18":{":":["shift",34]},"19":{"$end":["reduce",15]},"20":{"]":["shift",35],",":["shift",36]},"21":{",":["reduce",18],"]":["reduce",18]},"22":{",":["reduce",2],"]":["reduce",2]},"23":{",":["reduce",3],"]":["reduce",3]},"24":{",":["reduce",4],"]":["reduce",4]},"25":{",":["reduce",5],"]":["reduce",5]},"26":{",":["reduce",6],"]":["reduce",6]},"27":{",":["reduce",7],"]":["reduce",7]},"28":{",":["reduce",8],"]":["reduce",8]},"29":{",":["reduce",9],"]":["reduce",9]},"30":{"}":["shift",37],"STRING":["shift",18]},"31":{"]":["shift",39],"NULL":["shift",22],"STRING":["shift",24],"NUMBER":["shift",25],"TRUE":["shift",28],"FALSE":["shift",29],"{":["shift",30],"[":["shift",31]},"32":{"$end":["reduce",11]},"33":{"STRING":["shift",18]},"34":{"NULL":["shift",43],"STRING":["shift",45],"NUMBER":["shift",46],"TRUE":["shift",49],"FALSE":["shift",50],"{":["shift",51],"[":["shift",52]},"35":{"$end":["reduce",16]},"36":{"NULL":["shift",22],"STRING":["shift",24],"NUMBER":["shift",25],"TRUE":["shift",28],"FALSE":["shift",29],"{":["shift",30],"[":["shift",31]},"37":{",":["reduce",10],"]":["reduce",10]},"38":{"}":["shift",54],",":["shift",33]},"39":{",":["reduce",15],"]":["reduce",15]},"40":{"]":["shift",55],",":["shift",36]},"41":{",":["reduce",12],"}":["reduce",12]},"42":{",":["reduce",14],"}":["reduce",14]},"43":{",":["reduce",2],"}":["reduce",2]},"44":{",":["reduce",3],"}":["reduce",3]},"45":{",":["reduce",4],"}":["reduce",4]},"46":{",":["reduce",5],"}":["reduce",5]},"47":{",":["reduce",6],"}":["reduce",6]},"48":{",":["reduce",7],"}":["reduce",7]},"49":{",":["reduce",8],"}":["reduce",8]},"50":{",":["reduce",9],"}":["reduce",9]},"51":{"}":["shift",56],"STRING":["shift",18]},"52":{"]":["shift",58],"NULL":["shift",22],"STRING":["shift",24],"NUMBER":["shift",25],"TRUE":["shift",28],"FALSE":["shift",29],"{":["shift",30],"[":["shift",31]},"53":{",":["reduce",17],"]":["reduce",17]},"54":{",":["reduce",11],"]":["reduce",11]},"55":{",":["reduce",16],"]":["reduce",16]},"56":{",":["reduce",10],"}":["reduce",10]},"57":{"}":["shift",60],",":["shift",33]},"58":{",":["reduce",15],"}":["reduce",15]},"59":{"]":["shift",61],",":["shift",36]},"60":{",":["reduce",11],"}":["reduce",11]},"61":{",":["reduce",16],"}":["reduce",16]}},"gotos":{"0":{"Json":1,"JsonValue":2,"BooleanLiteral":4,"JSONObject":7,"JSONArray":8},"11":{"JSONMemberList":16,"JSONMember":17},"12":{"JSONElementList":20,"JsonValue":21,"BooleanLiteral":23,"JSONObject":26,"JSONArray":27},"30":{"JSONMemberList":38,"JSONMember":17},"31":{"JSONElementList":40,"JsonValue":21,"BooleanLiteral":23,"JSONObject":26,"JSONArray":27},"33":{"JSONMember":41},"34":{"JsonValue":42,"BooleanLiteral":44,"JSONObject":47,"JSONArray":48},"36":{"JsonValue":53,"BooleanLiteral":23,"JSONObject":26,"JSONArray":27},"51":{"JSONMemberList":57,"JSONMember":17},"52":{"JSONElementList":59,"JsonValue":21,"BooleanLiteral":23,"JSONObject":26,"JSONArray":27}}},
productions: [{"symbol":"$accept","nullable":false,"firsts":["NULL","TRUE","FALSE","STRING","NUMBER","{","["],"rhs":["Json","$end"],"srhs":"Json $end","id":0,"actionCode":"this.$$ = $1;"},{"symbol":"Json","nullable":false,"firsts":["NULL","TRUE","FALSE","STRING","NUMBER","{","["],"rhs":["JsonValue","$end"],"srhs":"JsonValue $end","id":1,"actionCode":"\n            this.$$ = $1;\n        "},{"symbol":"JsonValue","nullable":false,"firsts":["NULL"],"rhs":["NULL"],"srhs":"NULL","id":2,"actionCode":"\n            this.$$ = null;\n        "},{"symbol":"JsonValue","nullable":false,"firsts":["TRUE","FALSE"],"rhs":["BooleanLiteral"],"srhs":"BooleanLiteral","id":3,"actionCode":"\n            this.$$ = $1;\n        "},{"symbol":"JsonValue","nullable":false,"firsts":["STRING"],"rhs":["STRING"],"srhs":"STRING","id":4,"actionCode":"\n            this.$$ = $1;\n        "},{"symbol":"JsonValue","nullable":false,"firsts":["NUMBER"],"rhs":["NUMBER"],"srhs":"NUMBER","id":5,"actionCode":"\n            this.$$ = parseFloat($1);\n        "},{"symbol":"JsonValue","nullable":false,"firsts":["{"],"rhs":["JSONObject"],"srhs":"JSONObject","id":6,"actionCode":"\n            this.$$ = $1;\n        "},{"symbol":"JsonValue","nullable":false,"firsts":["["],"rhs":["JSONArray"],"srhs":"JSONArray","id":7,"actionCode":"\n            this.$$ = $1;\n        "},{"symbol":"BooleanLiteral","nullable":false,"firsts":["TRUE"],"rhs":["TRUE"],"srhs":"TRUE","id":8,"actionCode":"\n            this.$$ = true;\n        "},{"symbol":"BooleanLiteral","nullable":false,"firsts":["FALSE"],"rhs":["FALSE"],"srhs":"FALSE","id":9,"actionCode":"\n            this.$$ = false;\n        "},{"symbol":"JSONObject","nullable":false,"firsts":["{"],"rhs":["{","}"],"srhs":"{ }","id":10,"actionCode":"\n            this.$$ = {};\n        "},{"symbol":"JSONObject","nullable":false,"firsts":["{"],"rhs":["{","JSONMemberList","}"],"srhs":"{ JSONMemberList }","id":11,"actionCode":"\n            this.$$ = $2;\n        "},{"symbol":"JSONMemberList","nullable":false,"firsts":["STRING"],"rhs":["JSONMemberList",",","JSONMember"],"srhs":"JSONMemberList , JSONMember","id":12,"actionCode":"\n            this.$$ = $1;\n            this.$$ = _.merge(this.$$, $3);\n        "},{"symbol":"JSONMemberList","nullable":false,"firsts":["STRING"],"rhs":["JSONMember"],"srhs":"JSONMember","id":13,"actionCode":"\n            this.$$ = $1;\n        "},{"symbol":"JSONMember","nullable":false,"firsts":["STRING"],"rhs":["STRING",":","JsonValue"],"srhs":"STRING : JsonValue","id":14,"actionCode":"\n            this.$$ = {};\n            this.$$[$1] = $3;\n        "},{"symbol":"JSONArray","nullable":false,"firsts":["["],"rhs":["[","]"],"srhs":"[ ]","id":15,"actionCode":"\n            this.$$ = [];\n        "},{"symbol":"JSONArray","nullable":false,"firsts":["["],"rhs":["[","JSONElementList","]"],"srhs":"[ JSONElementList ]","id":16,"actionCode":"\n            this.$$ = $2;\n        "},{"symbol":"JSONElementList","nullable":false,"firsts":["NULL","STRING","NUMBER","TRUE","FALSE","{","["],"rhs":["JSONElementList",",","JsonValue"],"srhs":"JSONElementList , JsonValue","id":17,"actionCode":"\n            this.$$ = $1;\n            this.$$.push($3);\n        "},{"symbol":"JSONElementList","nullable":false,"firsts":["NULL","TRUE","FALSE","STRING","NUMBER","{","["],"rhs":["JsonValue"],"srhs":"JsonValue","id":18,"actionCode":"\n            this.$$ = [$1];\n        "}],
parse:function (input, isDebug){
            var self = this,

            stateStack = [0],       //状态栈  初始状态0
            symbolStack = [],       //符号栈
            valueStack = [],        //值栈

            lexer = self.lexer,
            token,
            state;

            lexer.setInput(input);
            token = self.lexer.getToken(isDebug);

            while(true){

                state = stateStack[stateStack.length - 1];

                var action = self.lrtable.actions[state] && self.lrtable.actions[state][token];

                if(!action && isDebug){
                    //这是编写bnf时容易出错的，通过当前输入和当前状态(状态隐含了当前入栈的符号)
                    //无法找到右端句柄，也无法通过当前输入决定应进行移进动作
                    debugger
                }

                if(isDebug){
                    console.log('当前状态:'+state, '输入符号:'+token, '动作:'+action);
                }
                if(action){
                    if(action[0] === 'shift'){
                        stateStack.push(action[1]);
                        symbolStack.push(token);
                        valueStack.push(lexer.yytext);
                        token = lexer.getToken(isDebug);
                    }else if(action[0] === 'reduce'){
                        var production = self.productions[action[1]];

                        var runstr = ('this.$$ = $1;'+production.actionCode)
                            .replace(/\$(\d+)/g, function(_, n){
                                return 'valueStack[' + (valueStack.length - production.rhs.length + parseInt(n, 10) - 1) + ']'
                            });

                        eval(runstr);


                        if(isDebug){
                            console.log(' 当前右端句柄为:' + production.rhs);
                            console.log(' 右端句柄对应值栈内容为:' + JSON.stringify(valueStack.slice(-production.rhs.length)));
                            console.log(' 归约后的值为:' + JSON.stringify(this.$$));
                        }

                        //如果是当前归约用的产生式不是epsilon:
                        //  符号栈才需要对右端句柄包含的各个symbol出栈，归约为产生式的非终结符(lhs)再入栈
                        //  值栈才需要对右端句柄对应的各个值出栈，进行归约计算为某个lhs值，再把lhs值入栈
                        //  状态栈也才需要对代表右端句柄的各个状态进行出栈，查goto表找到代表lhs符号的新状态入栈
                        //否则，应用epsilon，各栈保持原地不动
                        if(production.rhs.length){ 
                            symbolStack = symbolStack.slice(0, -production.rhs.length); 
                            valueStack = valueStack.slice(0, -production.rhs.length);
                            stateStack = stateStack.slice(0, -production.rhs.length); 
                        }

                        var curstate = stateStack[stateStack.length-1];

                        //查goto表，找到代表归约后的lhs符号的新状态
                        var newstate = self.lrtable.gotos[curstate] && self.lrtable.gotos[curstate][production.symbol];


                        if(isDebug){
                            console.log(' 右端句柄归约后的符号:'+production.symbol+',应转移到:'+newstate);
                        }
                        symbolStack.push(production.symbol);  //归约后的lhs符号，压入符号栈
                        valueStack.push(this.$$);  //语义动作中归约后的值(rhs各项计算出的lhs值)，压入值栈
                        stateStack.push(newstate); //goto表查到的新状态，压入状态栈


                    }else if(action[0] === 'accept'){
                        if(isDebug){
                            console.log('accept');
                        }
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }
        }
};
if(typeof module == "object"){module.exports = parser}


global.fastparser = parser;

return parser;
})(this);