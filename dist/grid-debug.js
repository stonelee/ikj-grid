define("kj/grid/1.4.0/grid-debug", [ "jquery/jquery/1.10.1/jquery-debug", "arale/widget/1.0.3/widget-debug", "$-debug", "arale/base/1.0.1/base-debug", "arale/class/1.0.0/class-debug", "arale/events/1.0.0/events-debug", "arale/widget/1.0.3/templatable-debug", "gallery/handlebars/1.0.0/handlebars-debug", "gallery/underscore/1.4.4/underscore-debug", "./loading-debug", "./loading-debug.tpl", "./grid-debug.tpl", "./extraHeaderTd-debug.tpl", "./headerTd-debug.tpl", "./body-debug.tpl" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.10.1/jquery-debug"), Widget = require("arale/widget/1.0.3/widget-debug"), Templatable = require("arale/widget/1.0.3/templatable-debug"), Handlebars = require("gallery/handlebars/1.0.0/handlebars-debug"), _ = require("gallery/underscore/1.4.4/underscore-debug");
    function getScrollbarWidth() {
        //仅适用于桌面浏览器,手机浏览器结果为0,但是恰好其默认不会显示滚动条,所以刚好可用
        var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body");
        var child = parent.children();
        var width = child.innerWidth() - child.height(99).innerWidth();
        parent.remove();
        return width;
    }
    var Loading = require("./loading-debug");
    var Grid = Widget.extend({
        Implements: Templatable,
        attrs: {
            url: "",
            urlParser: null,
            data: []
        },
        template: require("./grid-debug.tpl"),
        model: {
            fields: [],
            title: "",
            paginate: true,
            needCheckbox: false,
            checkboxWidth: 30,
            needOrder: false,
            orderWidth: 30,
            width: null,
            height: null
        },
        parseElement: function() {
            _.defaults(this.model, {
                width: $(this.get("parentNode")).innerWidth(),
                records: [],
                isFirst: true,
                isLast: true,
                hasPrev: false,
                hasNext: false,
                totalCount: 0,
                pageSize: 0,
                pageNumbers: 0
            });
            this.model.headers = this._processHeaders();
            this.model.fields = this._processFields();
            this.model.scrollWidth = getScrollbarWidth();
            Grid.superclass.parseElement.call(this);
        },
        _processHeaders: function() {
            var headers = [];
            //get headers
            function loopHeader(nodes, level) {
                if (headers.length < level + 1) {
                    headers.push(nodes);
                } else {
                    headers[level] = headers[level].concat(nodes);
                }
                var nextLevel = level + 1;
                $.each(nodes, function() {
                    if (this.children && this.children.length > 0) {
                        loopHeader(this.children, nextLevel);
                    }
                });
            }
            loopHeader(this.model.fields, 0);
            //set colspan & rowspan
            function loopChildren(nodes, num) {
                var result = num + nodes.length;
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    if (node.children && node.children.length > 0) {
                        result = loopChildren(node.children, result - 1);
                    }
                }
                return result;
            }
            var levelNum = headers.length;
            for (var i = 0; i < levelNum; i++) {
                var header = headers[i];
                for (var j = 0; j < header.length; j++) {
                    var h = header[j];
                    if (h.children && h.children.length > 0) {
                        var colspan = 0;
                        colspan = loopChildren(h.children, colspan);
                        h.colspan = colspan;
                    } else {
                        if (levelNum > 1) {
                            h.rowspan = levelNum - i;
                        }
                        if (h.rowspan == 1) {
                            delete h.rowspan;
                        }
                    }
                }
            }
            return headers;
        },
        _processFields: function() {
            var specWidth = 0, specNum = 0, fields = [];
            function loopHeader(nodes) {
                $.each(nodes, function() {
                    if (this.children && this.children.length > 0) {
                        loopHeader(this.children);
                    } else {
                        fields.push(this);
                        //子表头宽度有效
                        if (this.width) {
                            specWidth += this.width;
                            specNum += 1;
                        }
                    }
                });
            }
            loopHeader(this.model.fields);
            //滚动条宽度
            var scrollWidth = 18;
            //过长表格
            if (specNum === fields.length && specWidth > this.model.width) {
                this.model.isLong = true;
                scrollWidth = 0;
            }
            return fields;
        },
        templateHelpers: {
            createHeader: function(headers) {
                //first tr
                var options = $.extend({}, this, {
                    needRowspan: this.headers.length > 1,
                    rowspan: this.headers.length
                });
                var extraTd = Handlebars.compile(require("./extraHeaderTd-debug.tpl"))(options);
                var trs = "<tr>" + extraTd;
                var tpl = require("./headerTd-debug.tpl");
                Handlebars.registerHelper("addSortClass", function(sort) {
                    if (sort == "asc" || sort == "desc") {
                        return new Handlebars.SafeString(" grid-is-" + sort);
                    }
                });
                var td = Handlebars.compile(tpl)({
                    headers: this.headers[0]
                });
                trs += td + "</tr>";
                //other tr
                for (var i = 1; i < this.headers.length; i++) {
                    trs += "<tr>";
                    td = Handlebars.compile(tpl)({
                        headers: this.headers[i]
                    });
                    trs += td + "</tr>";
                }
                return new Handlebars.SafeString(trs);
            }
        },
        setup: function() {
            var self = this;
            if (this.model.isLong) {
                this.$(".grid-view").scroll(function() {
                    self.$(".grid-hd").scrollLeft($(this).scrollLeft());
                });
            }
        },
        _onRenderUrl: function(url) {
            var self = this;
            this.showLoading();
            $.getJSON(url, function(data) {
                self._loadData(data.data);
                self.hideLoading();
            });
        },
        _onRenderData: function(data) {
            this._loadData(data);
        },
        _loadData: function(data) {
            var self = this;
            this.data = data;
            //body
            var records = $.map(data.result, function(record, index) {
                var order = "";
                if (self.model.needOrder) {
                    order = (data.pageNumber - 1) * data.pageSize + index + 1;
                }
                return {
                    isAlt: index % 2 === 1,
                    order: order,
                    values: $.map(self.model.fields, function(field) {
                        var value = record[field.name];
                        value = _.escape(value);
                        if ($.isFunction(field.render)) {
                            value = field.render(value);
                        }
                        var f = _.clone(field);
                        f.value = value;
                        return f;
                    })
                };
            });
            var body = Handlebars.compile(require("./body-debug.tpl"))($.extend({}, this.model, {
                records: records
            }));
            this.$(".grid-view tbody").html(body);
            //paginate
            $.extend(this.model, {
                isFirst: function() {
                    return data.pageNumber <= 1;
                },
                isLast: function() {
                    return data.totalPages === 0 || data.pageNumber === data.totalPages;
                },
                hasPrev: data.hasPrev,
                hasNext: data.hasNext,
                totalCount: data.totalCount,
                pageSize: data.pageSize,
                pageNumbers: function() {
                    return Math.ceil(data.totalCount / data.pageSize);
                }
            });
            this.renderPartial(".toolbar-ft");
            //将数据绑定到$row上
            var $rows = this.$(".grid-row");
            $.each(data.result, function(index, record) {
                $rows.eq(index).data("data", record);
            });
            //已选择的行
            if (this.model.needCheckbox) {
                this.selected = [];
            } else {
                this.selected = null;
            }
            var $checkAll = this.$("[data-role=checkAll]");
            if ($checkAll.length > 0) {
                $checkAll[0].indeterminate = false;
                $checkAll.prop("checked", false);
            }
            this.$("[data-role=num]").val(data.pageNumber);
            //disabled button will not be clicked
            this.$("i").click(function(e) {
                if (/disabled/.test(e.target.className)) {
                    e.stopImmediatePropagation();
                }
            });
            //TODO:复杂表头会出现问题
            $.each(this.model.fields, function(index, field) {
                if (field.phone === false) {
                    index += 1;
                    self.$("tr td:nth-child(" + index + ")").addClass("hidden-phone");
                    self.$("tr th:nth-child(" + index + ")").addClass("hidden-phone");
                }
                if (field.tablet === false) {
                    index += 1;
                    self.$("tr td:nth-child(" + index + ")").addClass("hidden-phone hidden-tablet");
                    self.$("tr th:nth-child(" + index + ")").addClass("hidden-phone hidden-tablet");
                }
            });
            this.trigger("loaded");
        },
        events: {
            "click .grid-hd": "_sort",
            "click .grid-row": "_click",
            "click [data-role=check]": "_check",
            "click [data-role=checkAll]": "_checkAll",
            "click [data-role=prev]": "prevPage",
            "click [data-role=next]": "nextPage",
            "click [data-role=first]": "firstPage",
            "click [data-role=last]": "lastPage",
            "click [data-role=refresh]": "refresh",
            "keyup [data-role=num]": "_gotoPage"
        },
        _sort: function(e) {
            var cell = $(e.target).closest("td");
            if (!cell.hasClass("grid-is-sortable")) return;
            var name = cell.attr("data-name");
            //只能按照单独的列排序
            if (!this._oldSortHeader) {
                this._oldSortHeader = cell;
            } else {
                if (this._oldSortHeader.attr("data-name") !== name) {
                    this._oldSortHeader.removeClass("grid-is-desc grid-is-asc");
                    this._oldSortHeader = cell;
                }
            }
            if (cell.hasClass("grid-is-desc")) {
                cell.removeClass("grid-is-desc").addClass("grid-is-asc");
                this.trigger("sort", name, "asc");
            } else {
                cell.removeClass("grid-is-asc").addClass("grid-is-desc");
                this.trigger("sort", name, "desc");
            }
        },
        _click: function(e) {
            var $target = $(e.target);
            var $row = $target.parents("tr");
            var data = $row.data("data");
            if (!this.model.needCheckbox) {
                if (this.selected && this.selected.data("data").id === data.id) {
                    this.selected = null;
                    $row.removeClass("grid-row-is-selected");
                } else {
                    this.selected = $row;
                    $row.addClass("grid-row-is-selected").siblings().removeClass("grid-row-is-selected");
                }
            }
            if ($target.attr("data-role") != "check") {
                this.trigger("click", $target, data);
            }
        },
        _check: function(e) {
            var $target = $(e.target);
            var $row = $target.parents("tr");
            var $checkAll = $("[data-role=checkAll]");
            $checkAll[0].indeterminate = true;
            if ($target.prop("checked")) {
                //选中
                this.selected.push($row);
                $row.addClass("grid-row-is-selected");
                //如果全部选中
                if ($("[data-role=check]").not(":checked").length === 0) {
                    $checkAll[0].indeterminate = false;
                    $checkAll.prop("checked", true);
                }
            } else {
                var id = $row.data("data").id;
                for (var i = this.selected.length - 1; i >= 0; i--) {
                    if (this.selected[i].data("data").id === id) {
                        this.selected.splice(i, 1);
                    }
                }
                $row.removeClass("grid-row-is-selected");
                //如果全部取消选中
                if (!$("[data-role=check]").is(":checked")) {
                    $checkAll[0].indeterminate = false;
                    $checkAll.prop("checked", false);
                }
            }
        },
        _checkAll: function(e) {
            var $target = $(e.target);
            var $checks = this.$("[data-role=check]");
            var $rows = $checks.parents("tr");
            if ($target.prop("checked")) {
                var selected = [];
                $rows.each(function(index, row) {
                    selected.push($(row));
                });
                this.selected = selected;
                $checks.prop("checked", true);
                $rows.addClass("grid-row-is-selected");
            } else {
                this.selected = [];
                $checks.prop("checked", false);
                $rows.removeClass("grid-row-is-selected");
            }
        },
        _gotoPage: function(e) {
            var $input = $(e.target);
            var value = $input.val();
            if (value && e.which == 13) {
                this.gotoPage(value);
            } else {
                value = value.replace(/\D/g, "");
                if (value) {
                    value = parseInt(value, 10);
                    var totalPages = this.data.totalPages;
                    if (value > totalPages) {
                        value = totalPages;
                    } else if (value === 0) {
                        value = 1;
                    }
                    $input.val(value);
                } else {
                    $input.val("");
                }
            }
        },
        //public method
        gotoPage: function(id) {
            var r = this.get("urlParser");
            var url = this.get("url").replace(r, "$1" + id + "$2");
            this.set("url", url);
        },
        prevPage: function() {
            var id = this.data.prevPage;
            this.gotoPage(id);
        },
        nextPage: function() {
            var id = this.data.nextPage;
            this.gotoPage(id);
        },
        firstPage: function() {
            var id = this.data.firstPage;
            this.gotoPage(id);
        },
        lastPage: function() {
            var id = this.data.lastPage;
            this.gotoPage(id);
        },
        refresh: function() {
            //刷新往往不会改变url
            var url = this.get("url");
            this._onRenderUrl(url);
        },
        showLoading: function() {
            if (this.loading) {
                this.loading.element.show();
            } else {
                this.loading = new Loading({
                    parentNode: this.$(".grid-bd"),
                    model: {
                        left: (this.model.width - 106) / 2,
                        top: (this.model.height - 36) / 2
                    }
                }).render();
            }
        },
        hideLoading: function() {
            this.loading.element.hide();
        }
    });
    module.exports = Grid;
});

define("kj/grid/1.4.0/loading-debug", [ "jquery/jquery/1.10.1/jquery-debug", "arale/widget/1.0.3/widget-debug", "$-debug", "arale/base/1.0.1/base-debug", "arale/class/1.0.0/class-debug", "arale/events/1.0.0/events-debug", "arale/widget/1.0.3/templatable-debug", "gallery/handlebars/1.0.0/handlebars-debug" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.10.1/jquery-debug"), Widget = require("arale/widget/1.0.3/widget-debug"), Templatable = require("arale/widget/1.0.3/templatable-debug");
    var Loading = Widget.extend({
        Implements: Templatable,
        template: require("kj/grid/1.4.0/loading-debug.tpl"),
        model: {
            left: 0,
            top: 0,
            content: "加载中..."
        }
    });
    module.exports = Loading;
});

define("kj/grid/1.4.0/loading-debug.tpl", [], '<div class="mask">\n  <div class="mask-bg"></div>\n  <div class="mask-msg" style="left:{{left}}px;top:{{top}}px;">\n    <div class="loading">{{content}}</div>\n  </div>\n</div>\n');

define("kj/grid/1.4.0/grid-debug.tpl", [], '<div class="panel-mod" style="width:{{width}}px;">\n  {{#if title}}\n  <div class="panel-hd">\n    <span>{{title}}</span>\n  </div>\n  {{/if}}\n  <div class="panel-bd">\n\n    <div class="grid-hd">\n      <table>\n        <thead>\n          <tr>\n            {{#if needCheckbox}}\n              <th style="width:{{checkboxWidth}}px;"></th>\n            {{/if}}\n            {{#if needOrder}}\n              <th style="width:{{orderWidth}}px;"></th>\n            {{/if}}\n            {{#each fields}}\n              <th style="width:{{width}}px;"></th>\n            {{/each}}\n            <th style="width:{{scrollWidth}}px;"></th>\n          </tr>\n        </thead>\n        <tbody>\n          {{createHeader headers}}\n        </tbody>\n      </table>\n    </div>\n\n    <div class="grid-bd" style="height:{{height}}px;">\n      <div class="grid-view"{{#unless isLong}} style="_overflow-x:hidden;"{{/unless}}>\n        <table>\n          <thead>\n            <tr>\n              {{#if needCheckbox}}\n                <th style="width:{{checkboxWidth}}px;"></th>\n              {{/if}}\n              {{#if needOrder}}\n                <th style="width:{{orderWidth}}px;"></th>\n              {{/if}}\n              {{#each fields}}\n                <th style="width:{{width}}px;"></th>\n              {{/each}}\n            </tr>\n          </thead>\n          <tbody></tbody>\n        </table>\n      </div>\n    </div>\n\n    {{#if paginate}}\n      <div class="toolbar-ft">\n        <span class="toolbar-text-right">共{{totalCount}}条记录，每页{{pageSize}}条</span>\n        <i class="{{#if isFirst}}icon-grid-page-first-disabled{{else}}icon-grid-page-first{{/if}}" data-role="first"></i>\n        <i class="{{#if hasPrev}}icon-grid-page-prev{{else}}icon-grid-page-prev-disabled{{/if}}" data-role="prev"></i>\n        <i class="toolbar-separator"></i>\n        <span class="toolbar-text">当前第</span>\n        <input class="input" style="width:40px;" type="text" data-role="num">\n        <span class="toolbar-text">/{{pageNumbers}}页</span>\n        <i class="toolbar-separator"></i>\n        <i class="{{#if hasNext}}icon-grid-page-next{{else}}icon-grid-page-next-disabled{{/if}}" data-role="next"></i>\n        <i class="{{#if isLast}}icon-grid-page-last-disabled{{else}}icon-grid-page-last{{/if}}" data-role="last"></i>\n        <i class="toolbar-separator"></i>\n        <i class="icon-grid-refresh" data-role="refresh"></i>\n      </div>\n    {{/if}}\n  </div>\n</div>\n');

define("kj/grid/1.4.0/extraHeaderTd-debug.tpl", [], '{{#if needCheckbox}}\n  <td class="grid-cell" width="{{checkboxWidth}}"{{#if needRowspan}} rowspan="{{rowspan}}"{{/if}}>\n    <input type="checkbox" data-role="checkAll"/>\n  </td>\n{{/if}}\n{{#if needOrder}}\n  <td class="grid-cell" width="{{orderWidth}}"{{#if needRowspan}} rowspan="{{rowspan}}"{{/if}}></td>\n{{/if}}\n');

define("kj/grid/1.4.0/headerTd-debug.tpl", [], '{{#each headers}}\n  <td class="grid-cell{{addSortClass sort}}{{#if sort}} grid-is-sortable{{/if}}"\n    {{#if name}} data-name="{{name}}"{{/if}}\n    {{#if rowspan}} rowspan="{{rowspan}}"{{/if}}\n    {{#if colspan}} colspan="{{colspan}}"{{/if}}\n    ><span>{{header}}</span>\n  </td>\n{{/each}}\n');

define("kj/grid/1.4.0/body-debug.tpl", [], '{{#each records}}\n  <tr class="grid-row{{#if isAlt}} grid-row-alt{{/if}}">\n    {{#if ../needCheckbox}}\n      <td class="grid-cell grid-mark-cell">\n        <input type="checkbox" data-role="check"/>\n      </td>\n    {{/if}}\n    {{#if ../needOrder}}\n      <td class="grid-cell grid-mark-cell">\n        {{order}}\n      </td>\n    {{/if}}\n    {{#each values}}\n      <td class="grid-cell"{{#if align}} style="text-align:{{align}};"{{/if}}>\n        {{{value}}}\n      </td>\n    {{/each}}\n  </tr>\n{{/each}}\n');
