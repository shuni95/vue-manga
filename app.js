new Vue({
    el: "#vue-app",

    data: {
        mangas: [],
        pages: [],
        actualPage: {},
        actualChapter: 0,
        actualManga: {},
        showAskNextChapter: false,
        showMessageLastChapter: false,
    },

    methods: {
        changePage: function (event) {
            coordX = event.clientX;
            marginLeft = parseInt(window.getComputedStyle(event.currentTarget).marginLeft);

            startX = coordX - marginLeft;
            width = window.innerWidth - 2 * marginLeft;

            if (startX > 0.3 * width) {
                this.nextPage();
            } else {
                this.prevPage();
            }
        },

        choosePage: function (event) {
            this.actualPage = this.pages[event.target.value-1];
        },

        prevPage: function () {
            if (this.actualPage) {
                if (this.actualPage.page > 1) {
                    if (this.actualPage.page == this.pages.length && this.showAskNextChapter) {
                        this.showAskNextChapter = false;
                    } else {
                        this.actualPage = this.pages[this.actualPage.page-2];
                    }
                }
            }
        },

        nextPage: function () {
            if (this.actualPage) {
                // Dont add 1 because array start on 0
                if (this.actualPage.page == this.pages.length) {
                    if (this.actualChapter != this.actualManga.chapters) {
                        this.showAskNextChapter = true;
                    } else {
                        this.showMessageLastChapter = true;
                    }
                } else {
                    this.actualPage = this.pages[this.actualPage.page];
                }
            }
        },

        loadNextChapter: function () {
            this.$http.get('data/one-piece-'+ (++this.actualChapter) +'.json').then(response => {
                this.pages = response.body;
                this.actualPage = response.body[0];
                this.showAskNextChapter = false;
            });
        },
    },

    mounted: function () {
        var vm = this;
        window.addEventListener('keyup', function(event) {
            var left = 37;
            var right = 39;
            var key = event.keyCode;

            if (key == left) {
                vm.prevPage();
            } else if (key == right) {
                vm.nextPage();
            }
        });

        this.$http.get('data/mangas.json').then(response => {
            this.mangas = response.body;
            this.actualManga = this.mangas[0];
        });

        // First chapter
        this.loadNextChapter();
    },

});
