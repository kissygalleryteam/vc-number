KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('vc-number', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','kg/vc-number/1.0.0/']});