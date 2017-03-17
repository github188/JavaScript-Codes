



function* hwGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}

var hw = hwGenerator();

var next;

while (1) {

    next = hw.next();

    console.log(next );

    if (next.value === undefined ) { break; };

}