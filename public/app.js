let app = {
    el: "#app",
    data() {
        return {
            showSction1: true,
            showSction2: false,
            apis: {}
        }
    },
    methods: {
        openSection2() {
            this.showSction1 = false;
            this.showSction2 = true;
        },
        openSection1() {
            this.showSction1 = true;
            this.showSction2 = false;
        },
        getColorByMethod(method) {
            switch (method) {
                case 'GET':
                    return 'has-text-primary'
                    break;
                case 'POST':
                    return 'has-text-info'
                    break;
                case 'PUT':
                    return 'has-text-success'
                    break;
                case 'DELETE':
                    return 'has-text-danger'
                    break;
                default:
                    return 'has-text-grey'
                    break;
            }
        }
    },
    created() {
        fetch('/data.json')
            .then(response => response.json())
            .then(data => {
                this.apis = data;
            })
    }
}

new Vue(app);