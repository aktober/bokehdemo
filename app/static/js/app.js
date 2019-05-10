new Vue({
    el: '#app',
    delimiters: ["[[", "]]"],
    data: {
        columns: [],
        xSelected: '',
        ySelected: '',
        bScript: '',
        bDiv: '',
        htmlPart: '',
        loading: false,
    },
    methods: {
        getCookie: function (name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        },
        getGraphScriptDiv: function () {
            console.log('getGraphScriptDiv');
            this.loading = true;
            var data = {x: this.xSelected,
                        y: this.ySelected};
            var self = this;
            $.ajax({
                url: '/api/graph/',
                type: 'GET',
                data: data,
                success: function (result) {
                    self.bScript = result.script;
                    self.bDiv = result.div;
                    self.loading = false;
                }
            });
        },
        getRenderedGraph: function () {
            console.log('getRenderedGraph');
            var self = this;
            var csrftoken = this.getCookie('csrftoken');
            var data = {bScript: this.bScript,
                        bDiv: this.bDiv};
            $.ajax({
                url: '/ajax/',
                type: 'POST',
                data: data,
                headers: { 'X-CSRFToken': csrftoken },
                success: function (result) {
                    self.htmlPart = result.rendered;
                }
            });
        },
        getColumns: function () {
            self = this;
            $.ajax({
                url: '/api/columns/',
                type: 'GET',
                success: function (result) {
                    self.columns = result.columns;
                }
            });
        }
    },
    mounted() {
        this.getColumns();
    },
    watch: {
        columns: function (val) {
            this.xSelected = val.length > 0 ? val[0] : '';
            this.ySelected = val.length > 0 ? val[1] : '';
        },
        xSelected: function (val) {
            if (this.ySelected !== '') {
                this.getGraphScriptDiv();
            }
        },
        ySelected: function (val) {
            if (this.xSelected !== '') {
                this.getGraphScriptDiv();
            }
        },
        htmlPart: function (val) {
            $('div#plot').html(this.htmlPart);
        },
        loading: function (val) {
            if (val === false) {
                this.getRenderedGraph();
            }
        }
    },
});