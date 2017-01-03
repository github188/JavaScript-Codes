// list controller

function createDateTbl( dates ) {
    var lines = 8,
        len = 0, i = 0, date,
        prefix = '', row;

    len = dates.length;

    prefix = 'ctl-list-';

    for ( ; i < len; i++ ) {

        date = dates[i] || '';

    }
}

function refreshDateTbl( data ) {
    console.log( data )
    data.index++;
}

module.exports = {
    createDateTbl: createDateTbl,
    refreshDateTbl: refreshDateTbl
}