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
        getGraph: function () {
            console.log('getGraph');
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
            // console.log('bScript', this.bScript);
            // console.log('bDiv', this.bDiv);
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
        // this.getRenderedGraph();
    },
    watch: {
        columns: function (val) {
            this.xSelected = val.length > 0 ? val[0] : '';
            this.ySelected = val.length > 0 ? val[1] : '';
        },
        xSelected: function (val) {
            console.log('x', val, this.ySelected);
            if (this.ySelected !== '') {
                this.getGraph();
            }
        },
        ySelected: function (val) {
            console.log('y', val, this.xSelected);
            if (this.xSelected !== '') {
                this.getGraph();
            }
        },
        htmlPart: function (val) {
            console.log('new htmlPart');
            $('div#plot').html(this.htmlPart);
        },
        loading: function (val) {
            console.log('loading', val);
            if (val === false) {
                this.getRenderedGraph();
            }
        }
    },
});