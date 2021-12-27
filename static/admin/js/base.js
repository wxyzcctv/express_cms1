$(function () {
	app.init();
});

var app = {

	init() {
		this.toggleAside();
		this.deleteConfirm();
		this.resizeIframe();
        this.changeStatus()
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
        $('.chStatus').click(function () {
            let id = $(this).attr("data-id");
            let model = $(this).attr('data-model');
            let field = $(this).attr('data-field');
            let el = $(this);
            $.get('/admin/changeStatus',{id,model,field},function (response) {
                if (response.success){
					if(el.attr("src").indexOf("yes")!=-1){
						el.attr("src", "/admin/images/no.gif");
					}else{
						el.attr("src", "/admin/images/yes.gif");
					}
				}
            })
        })
    }
};

$(window).resize(function () {
	app.resizeIframe()
})