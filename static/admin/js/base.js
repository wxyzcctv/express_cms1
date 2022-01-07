$(function () {
	app.init();
});

var app = {
    adminPath: 'admin_express',
	init() {
		this.toggleAside();
		this.deleteConfirm();
		this.resizeIframe();
        this.changeStatus();
        this.changeNum();
	},
	deleteConfirm() {
		$('.delete').click(function () {
			const flag = confirm('您确定要删除吗?');
			return flag;
		});
	},
	resizeIframe() {
		const heights = document.documentElement.clientHeight - 100;
        let rightMainObj = document.getElementById('rightMain');
        if (rightMainObj) {
            rightMainObj.height = heights;            
        }
	},
	toggleAside() {
		$('.aside h4').click(function () {
			$(this).siblings('ul').slideToggle();
		})
	},
    changeStatus(){
        let adminPath = this.adminPath;
        $('.chStatus').click(function () {
            let id = $(this).attr("data-id");
            let model = $(this).attr('data-model');
            let field = $(this).attr('data-field');
            let el = $(this);
            $.get('/'+adminPath+'/changeStatus',{id,model,field},function (response) {
                if (response.success){
					if(el.attr("src").indexOf("yes")!=-1){
						el.attr("src", "/admin/images/no.gif");
					}else{
						el.attr("src", "/admin/images/yes.gif");
					}
				}
            })
        })
    },
    changeNum(){
        /*
		1、获取el里面的值  var spanNum=$(this).html()

		2、创建一个input的dom节点   var input=$("<input value='' />");

		3、把input放在el里面   $(this).html(input);

		4、让input获取焦点  给input赋值    $(input).trigger('focus').val(spanNum);

		5、点击input的时候阻止冒泡 

					$(input).click(function(e){
						e.stopPropagation();				
					})

		6、鼠标离开的时候给span赋值,并触发ajax请求

			$(input).blur(function(){
				var inputNum=$(this).val();
				spanEl.html(inputNum);
				触发ajax请求				
			})
		*/
        let adminPath = this.adminPath;
        $('.chSpanNum').click(function () {
            let id = $(this).attr("data-id");
            let model = $(this).attr('data-model');
            let field = $(this).attr('data-field');
            let el = $(this);
            let spanNum = $(this).html();
            let input = $("<input value='' style='width:60px'/>");
            $(this).html(input);
            $(input).trigger('focus').val(spanNum);
            $(input).click(function(e){
				e.stopPropagation();				
			})
            $(input).blur(function () {
                let inputNum = $(this).val();
                if (inputNum) {
                    el.html(inputNum);
                } else {
                    el.html(0);
                }
                $.get('/'+adminPath+'/changeNum',{id,model,field,num:inputNum},function (response) {
                    if (!response.success){
                        console.log(response);
                    }
                })
            })
        })
    },
};

$(window).resize(function () {
	app.resizeIframe()
})