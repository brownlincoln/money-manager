
//ready for operate
$(function() {
    $("#input-form").submit(function() {
       // console.log('form submit');
        var flag = checkInput(); 
        if(flag === false) {
            return false;
        }
        calculateResult();
    });

    var counterIn = 0;
    var counterOut = 0;
    $("#addInRandom").click(function() {
        if(counterIn > 5) {
            alert("只允许添加最多5个输入框");
            return false;
        }
        var newInTextBoxDiv = $(document.createElement('div')).attr("id", "in-textbox-div-" + counterIn);
        newInTextBoxDiv.after().html(
            '<label for="">理由：</label><input id="in-random-input-reason-' + counterIn + '" class="form-control" type="text"/>' +
            '<label for="">时间：</label><input id="in-random-input-date-' + counterIn + '" class="form-control" type="date" data-date-inline-picker="true" />' +
            '<label for="">金额：</label><input id="in-random-input-amount-' + counterIn + '" class="form-control" type="text"/>' +
            '<button id="remove-in-random-btn-' + counterIn + '" name="in-random" class="btn btn-danger btn-sm pull-right" type="button"><i class="fa fa-minus-circle"></i></button>'
        );
        newInTextBoxDiv.appendTo("#in-random-list");
        counterIn++;
    });

    $("#in-random-list").on("click", "button[name=in-random]", function(events) {
        alert("remove item");
        if(counterIn === 0) {
            alert("没有可以删除的了");
            return false;
        }
        $(this).parents('div').eq(1).remove();
         counterIn--;
    });
    
});



function checkInput() {
    var errors = 0;
    //alert('hello checkinput');
    $("#input-form :input").map(function() {
        //console.log('map');
        if($(this).attr('id') === 'total-input') {
            if(!$(this).val().trim()) {
                $(this).addClass('haswarning');
                errors++;
            }
        }
        if($(this).attr('id') === 'end-time-input') {
            if(!$(this).val().trim()) {
                $(this).addClass('haswarning');
                errors++;
            }
        }
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
    var totalMoneyNow = $("#total-input").val().trim();
    var endTime = $("#end-time-input").val().trim();
    var surplusMoney = totalMoneyNow;
    var msg = "在" + endTime + "，您的现金为" +　surplusMoney;

    $(".msg").text(msg);

}