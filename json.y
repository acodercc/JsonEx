%start Json
%%

Json :
     JsonValue $end
        {
            this.$$ = $1;
        }
;

JsonValue :
    NULL
        {
            this.$$ = null;
        }
    | BooleanLiteral
        {
            this.$$ = $1;
        }
    | STRING
        {
            this.$$ = $1;
        }
    | NUMBER
        {
            this.$$ = parseFloat($1);
        }
    | JSONObject
        {
            this.$$ = $1;
        }
    | JSONArray
        {
            this.$$ = $1;
        }
;

BooleanLiteral :
    TRUE
        {
            this.$$ = true;
        }
    | FALSE
        {
            this.$$ = false;
        }
;

JSONObject :
    { }
        {
            this.$$ = {};
        }
    | { JSONMemberList }
        {
            this.$$ = $2;
        }
;

JSONMemberList :
    JSONMemberList , JSONMember
        {
            this.$$ = $1;
            this.$$ = _.merge(this.$$, $3);
        }
    | JSONMember
        {
            this.$$ = $1;
        }
;
JSONMember :
    STRING : JsonValue
        {
            this.$$ = {};
            this.$$[$1] = $3;
        }
;

JSONArray :
    [ ]
        {
            this.$$ = [];
        }
    | [ JSONElementList ]
        {
            this.$$ = $2;
        }
;
JSONElementList:
    JSONElementList , JsonValue
        {
            this.$$ = $1;
            this.$$.push($3);
        }
    | JsonValue
        {
            this.$$ = [$1];
        }
;



%%

global.fastparser = parser;
