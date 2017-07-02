
//ready for operate
$(function() {
    $("#input-form").submit(function() {
       // console.log('form submit');
        preProcess();
        var flag = checkInput(); 
        if(flag === false) {
            return false;
        }
        calculateResult();
        postProcess();
    });

    //增加和删除不固定收入的输入框
    var counterIn = 0;
    var counterOut = 0;
    var inRowAllowed = 20;
    var outRowAllowed = 20;
    $("#addInRandom").click(function() {
        if(counterIn > inRowAllowed) {
            alert("只允许添加最多" + inRowAllowed + "个输入框");
            return false;
        }
        var newInTextBoxDiv = $(document.createElement('div')).attr({"id": "in-textbox-div-" + counterIn, "class": "in-random-row"});
        newInTextBoxDiv.after().html(
            '<label for="">理由<i class="fa fa-asterisk" aria-hidden="true"></i>：</label><input id="in-random-input-reason-' + counterIn + '" class="form-control" type="text"/>' +
            '<label for="">时间<i class="fa fa-asterisk" aria-hidden="true"></i>：</label><input id="in-random-input-date-' + counterIn + '" class="form-control" type="date" data-date-inline-picker="true" />' +
            '<label for="">金额<i class="fa fa-asterisk" aria-hidden="true"></i>：</label><input id="in-random-input-amount-' + counterIn + '" class="form-control" type="text"/>' +
            '<button id="remove-in-random-btn-' + counterIn + '" name="in-random" class="btn btn-danger btn-sm" type="button"><i class="fa fa-minus-circle"></i></button>'
        );
        newInTextBoxDiv.appendTo("#in-random-list");
        counterIn++;
    });

    $("#in-random-list").on("click", "button[name=in-random]", function(events) {
       // alert("remove item");
        if(counterIn === 0) {
            alert("没有可以删除的了");
            return false;
        }
        $(this).closest('div.in-random-row').remove();
        counterIn--;
    });
    //增加和删除不固定支出的输入框
    $("#addOutRandom").click(function() {
        if(counterOut > outRowAllowed) {
            alert("只允许添加最多" + outRowAllowed + "个输入框");
            return false;
        }
        
        var newOutTextBoxDiv = $(document.createElement('div')).attr({"id": "out-textbox-div-" + counterOut, "class": "out-random-row"});
        newOutTextBoxDiv.after().html(
            '<label for="">理由<i class="fa fa-asterisk" aria-hidden="true"></i>：</label><input id="out-random-input-reason-' + counterOut + '" class="form-control" type="text"/>' +
            '<label for="">时间<i class="fa fa-asterisk" aria-hidden="true"></i>：</label><input id="out-random-input-date-' + counterOut + '" class="form-control" type="date" data-date-inline-picker="true" />' +
            '<label for="">金额<i class="fa fa-asterisk" aria-hidden="true"></i>：</label><input id="out-random-input-amount-' + counterOut + '" class="form-control" type="text"/>' +
            '<button id="remove-out-random-btn-' + counterOut + '" name="out-random" class="btn btn-danger btn-sm" type="button"><i class="fa fa-minus-circle"></i></button>'
        );
        newOutTextBoxDiv.appendTo("#out-random-list");
        //alert('out random');
        counterOut++;
    });
    $("#out-random-list").on("click", "button[name=out-random]", function(events) {
        //alert("remove item");
        if(counterOut === 0) {
            alert("没有可以删除的了");
            return false;
        }
        $(this).closest('div.out-random-row').remove();
        counterOut--;
    });
    
});



function checkInput() {
    var errors = 0;
    //alert('hello checkinput');
    $("#input-form :input").map(function() {
        //console.log('map');
        if($(this).attr('id') === 'total-input') {
            if(!$(this).val().trim()) {
                $(this).addClass('has-warning');
                errors++;
            }
        }
        if($(this).attr('id') === 'end-time-input') {
            if(!$(this).val().trim()) {
                $(this).addClass('has-warning');
                errors++;
            }
        }
    });
    //校验每月的不固定收入
    $('[id^="in-textbox-div-"]').map(function() {
        $(this).find("input").map(function() {
            if(!$(this).val().trim()) {
                $(this).addClass('has-warning');
                errors++;
            }
        });
    });
    //校验每月的不固定支出
    $('[id^="out-textbox-div-"]').map(function() {
        $(this).find("input").map(function() {
            if(!$(this).val().trim()) {
                $(this).addClass('has-warning');
                errors++;
            }
        });
    });
    if(errors > 0) {
        console.log(errors);
        $(".msg").text("加*的输入框必须填写");
        return false;
    }
    return true;
}

function calculateResult() {
    calculateSurplusMoney();
}

function calculateSurplusMoney() {
    var totalMoneyNow = +$("#total-input").val().trim();
    var curDate = getCurDate("yyyy-MM-dd");
    //console.log(curDate);
    var endDate = $("#end-time-input").val().trim();
    //console.log(typeof endDate);
    var inMonth = +($("#in-month-input").val().trim());
    var outMonth = +($("#out-month-input").val().trim());
    //得到不固定收入
    var inList = [];
     $('[id^="in-textbox-div-"]').map(function() {
        var tmpInList = [];
        var reason = $(this).children("input").eq(0).val().trim();
        var inDate = $(this).children("input").eq(1).val().trim();
        var inAmount = $(this).children("input").eq(2).val().trim();
        tmpInList.push(reason, inDate, inAmount);
        inList.push(tmpInList);
    });
    //console.log(inList);

    //得到不固定支出
    var outList = [];
     $('[id^="out-textbox-div-"]').map(function() {
        var tmpOutList = [];
        var reason = $(this).children("input").eq(0).val().trim();
        var inDate = $(this).children("input").eq(1).val().trim();
        var inAmount = $(this).children("input").eq(2).val().trim();
        tmpOutList.push(reason, inDate, inAmount);
        outList.push(tmpOutList);
    });

    //得到月份差异
    var yearDiff = endDate.split("-")[0] - curDate.split("-")[0];
    var monthDiff = +yearDiff * 12 + +(endDate.split("-")[1]) - +(curDate.split("-")[1]);

    var surplusMoney = totalMoneyNow;
    //在同一个月（月份差异为0），则只有每月固定收入，没有每月固定支出。我们认为，固定支出在月初，固定收入在月末

    if(yearDiff > 0) {
        surplusMoney += inMonth * (monthDiff + 1) - outMonth * (monthDiff);
    } else if(yearDiff === 0 && monthDiff > 0) {
        surplusMoney += inMonth * (monthDiff + 1) - outMonth * (monthDiff - 1);  
    } else if(monthDiff === 0) {
        surplusMoney += inMonth;
    }

    var variableIn = 0;
    for(var index in inList) {
        variableIn += (+inList[index][2]);
    }
    var variableOut = 0;
    for(var index in outList) {
        variableOut += (+outList[index][2]);
    }
    surplusMoney = surplusMoney + variableIn - variableOut;
    var msg = "在" + endDate.split("-")[0] + "年" + endDate.split("-")[1] + "月末" + "，您的现金为" +　surplusMoney;

    $(".msg").text(msg);

}

function preProcess() {
    $(".has-warning").removeClass("has-warning");
}

function postProcess() {

}

function getCurDate(f) {
    var curDate = null;
    if(f.trim() === "yyyy-MM-dd") {
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();

        var curDate = d.getFullYear() + '-' +
            (month<10 ? '0' : '') + month + '-' +
            (day<10 ? '0' : '') + day;
    }
    return curDate;
}