define("ikj/grid/1.4.0/grid",["jquery/jquery/1.10.1/jquery","arale/widget/1.0.3/widget","$","arale/base/1.0.1/base","arale/class/1.0.0/class","arale/events/1.0.0/events","arale/widget/1.0.3/templatable","gallery/handlebars/1.0.0/handlebars","gallery/underscore/1.4.4/underscore","./grid.css","./grid.tpl","./extraHeaderTd.tpl","./headerTd.tpl","./body.tpl"],function(a,b,c){function d(){var a=e('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),b=a.children(),c=b.innerWidth()-b.height(99).innerWidth();return a.remove(),c}var e=a("jquery/jquery/1.10.1/jquery"),f=a("arale/widget/1.0.3/widget"),g=a("arale/widget/1.0.3/templatable"),h=a("gallery/handlebars/1.0.0/handlebars"),i=a("gallery/underscore/1.4.4/underscore");a("./grid.css");var j=f.extend({Implements:g,attrs:{url:"",urlParser:null,data:[]},template:a("./grid.tpl"),model:{fields:[],title:"",paginate:!0,needCheckbox:!1,checkboxWidth:30,needOrder:!1,orderWidth:30,width:null,height:null},parseElement:function(){i.defaults(this.model,{width:e(this.get("parentNode")).innerWidth(),records:[],isFirst:!0,isLast:!0,hasPrev:!1,hasNext:!1,totalCount:0,pageSize:0,pageNumbers:0}),this.model.headers=this._processHeaders(),this.model.fields=this._processFields(),j.superclass.parseElement.call(this)},_processHeaders:function(){function a(b,d){c.length<d+1?c.push(b):c[d]=c[d].concat(b);var f=d+1;e.each(b,function(){this.children&&this.children.length>0&&a(this.children,f)})}function b(a,c){for(var d=c+a.length,e=0;e<a.length;e++){var f=a[e];f.children&&f.children.length>0&&(d=b(f.children,d-1))}return d}var c=[];a(this.model.fields,0);for(var d=c.length,f=0;d>f;f++)for(var g=c[f],h=0;h<g.length;h++){var i=g[h];if(i.children&&i.children.length>0){var j=0;j=b(i.children,j),i.colspan=j}else d>1&&(i.rowspan=d-f),1==i.rowspan&&delete i.rowspan}return c},_processFields:function(){function a(f){e.each(f,function(){this.children&&this.children.length>0?a(this.children):(d.push(this),this.width&&(b+=this.width,c+=1))})}var b=0,c=0,d=[];a(this.model.fields);var f=18;return c===d.length&&b>this.model.width&&(this.model.isLong=!0,f=0),d},templateHelpers:{createHeader:function(){var b=e.extend({},this,{needRowspan:this.headers.length>1,rowspan:this.headers.length}),c=h.compile(a("./extraHeaderTd.tpl"))(b),d="<tr>"+c,f=a("./headerTd.tpl");h.registerHelper("addSortClass",function(a){return"asc"==a||"desc"==a?new h.SafeString(" grid-is-"+a):void 0});var g=h.compile(f)({headers:this.headers[0]});d+=g+"</tr>";for(var i=1;i<this.headers.length;i++)d+="<tr>",g=h.compile(f)({headers:this.headers[i]}),d+=g+"</tr>";return new h.SafeString(d)}},setup:function(){var a=this;this.model.isLong&&this.$(".grid-view").scroll(function(){a.$(".grid-hd").scrollLeft(e(this).scrollLeft())})},_onRenderUrl:function(a){var b=this;this.showLoading(),e.getJSON(a,function(a){b._loadData(a.data),b.hideLoading()})},_onRenderData:function(a){this._loadData(a)},_loadData:function(b){function c(a){for(var b=[];a--;)b.push("");return b}function f(a){return g.model.needCheckbox&&a++,g.model.needOrder&&a++,a++,a}var g=this;this.data=b;var j=e.map(b.result,function(a,c){var d="";return g.model.needOrder&&(d=(b.pageNumber-1)*b.pageSize+c+1),{isAlt:1===c%2,order:d,values:e.map(g.model.fields,function(b){var c=a[b.name];"string"==typeof c&&(c=i.escape(c)),e.isFunction(b.render)&&(c=b.render(c));var d=i.clone(b);return d.value=c,d})}});if(j.length<b.pageSize)for(var k=j.length;k<b.pageSize;k++)j.push({isBlank:!0,isAlt:1===k%2,values:c(g.model.fields.length)});var l=h.compile(a("./body.tpl"))(e.extend({},this.model,{records:j}));this.$(".grid-view tbody").html(l),e.extend(this.model,{isFirst:function(){return b.pageNumber<=1},isLast:function(){return 0===b.totalPages||b.pageNumber===b.totalPages},hasPrev:b.hasPrev,hasNext:b.hasNext,totalCount:b.totalCount,pageSize:b.pageSize,pageNumbers:function(){return Math.ceil(b.totalCount/b.pageSize)}}),this.renderPartial(".toolbar-ft");var m=this.$(".grid-row");e.each(b.result,function(a,b){m.eq(a).data("data",b)}),this.selected=this.model.needCheckbox?[]:null;var n=this.$("[data-role=checkAll]");n.length>0&&(n[0].indeterminate=!1,n.prop("checked",!1)),0===b.totalCount?this.$("[data-role=num]").val(""):this.$("[data-role=num]").val(b.pageNumber),this.$("i").click(function(a){/disabled/.test(a.target.className)&&a.stopImmediatePropagation()}),this.$(".grid-view").innerHeight()<this.$(".grid-view table").innerHeight()?this.$(".grid-hd th[data-role=scroll]").css("width",d()):this.$(".grid-hd th[data-role=scroll]").css("width",0),e.each(this.model.fields,function(a,b){"phone"==b.hidden&&(a=f(a),g.$("tr td:nth-child("+a+")").addClass("hidden-phone"),g.$("tr th:nth-child("+a+")").addClass("hidden-phone")),"tablet"==b.hidden&&(a=f(a),g.$("tr td:nth-child("+a+")").addClass("hidden-phone hidden-tablet"),g.$("tr th:nth-child("+a+")").addClass("hidden-phone hidden-tablet"))}),this.$(".grid-view .grid-row").each(function(){e("td:visible:last",this).css("borderRight",0)}),this.trigger("loaded")},events:{"click .grid-hd":"_sort","click .grid-row[data-role!=blank]":"_click","click [data-role=check]":"_check","click [data-role=checkAll]":"_checkAll","click [data-role=prev]":"prevPage","click [data-role=next]":"nextPage","click [data-role=first]":"firstPage","click [data-role=last]":"lastPage","click [data-role=refresh]":"refresh","keyup [data-role=num]":"_gotoPage"},_sort:function(a){var b=e(a.target).closest("td");if(b.hasClass("grid-is-sortable")){var c=b.attr("data-name");this._oldSortHeader?this._oldSortHeader.attr("data-name")!==c&&(this._oldSortHeader.removeClass("grid-is-desc grid-is-asc"),this._oldSortHeader=b):this._oldSortHeader=b,b.hasClass("grid-is-desc")?(b.removeClass("grid-is-desc").addClass("grid-is-asc"),this.trigger("sort",c,"asc")):(b.removeClass("grid-is-asc").addClass("grid-is-desc"),this.trigger("sort",c,"desc"))}},_click:function(a){var b=e(a.target),c=b.parents("tr"),d=c.data("data");this.model.needCheckbox||(this.selected&&this.selected.data("data").id===d.id?(this.selected=null,c.removeClass("grid-row-is-selected")):(this.selected=c,c.addClass("grid-row-is-selected").siblings().removeClass("grid-row-is-selected"))),"check"!=b.attr("data-role")&&this.trigger("click",b,d)},_check:function(a){var b=e(a.target),c=b.parents("tr"),d=e("[data-role=checkAll]");if(d[0].indeterminate=!0,b.prop("checked"))this.selected.push(c),c.addClass("grid-row-is-selected"),0===e("[data-role=check]").not(":checked").length&&(d[0].indeterminate=!1,d.prop("checked",!0));else{for(var f=c.data("data").id,g=this.selected.length-1;g>=0;g--)this.selected[g].data("data").id===f&&this.selected.splice(g,1);c.removeClass("grid-row-is-selected"),e("[data-role=check]").is(":checked")||(d[0].indeterminate=!1,d.prop("checked",!1))}},_checkAll:function(a){var b=e(a.target),c=this.$("[data-role=check]"),d=c.parents("tr");if(b.prop("checked")){var f=[];d.each(function(a,b){f.push(e(b))}),this.selected=f,c.prop("checked",!0),d.addClass("grid-row-is-selected")}else this.selected=[],c.prop("checked",!1),d.removeClass("grid-row-is-selected")},_gotoPage:function(a){var b=e(a.target),c=b.val();if(c&&13==a.which)this.gotoPage(c);else if(c=c.replace(/\D/g,"")){c=parseInt(c,10);var d=this.data.totalPages;c>d?c=d:0===c&&(c=1),b.val(c)}else b.val("")},gotoPage:function(a){var b,c=this.get("urlParser");b=c?this.get("url").replace(c,"$1"+a+"$2"):this._getSpecUrl(a),this.set("url",b)},_getSpecUrl:function(a){var b=this.get("url");return-1==b.indexOf("pageNumber=")?b+="&pageNumber="+a:b=b.replace(/(pageNumber=)\d+/,"$1"+a),b},prevPage:function(){var a=this.data.prevPage;this.gotoPage(a)},nextPage:function(){var a=this.data.nextPage;this.gotoPage(a)},firstPage:function(){this.gotoPage(1)},lastPage:function(){var a=this.data.totalPages;this.gotoPage(a)},refresh:function(){var a=this.get("url");this._onRenderUrl(a)},showLoading:function(){this.loading?this.loading.show():this.loading=e('<div class="loading"><span><i class="icon-refresh icon-spin"></i>加载中...</span></div>').appendTo(this.$(".grid-bd"))},hideLoading:function(){this.loading.hide()},selectedData:function(a){if(this.model.needCheckbox)return e.map(this.selected,function(b){var c=b.data("data");return a?c[a]:c});if(this.selected){var b=this.selected.data("data");return a?b[a]:b}return null}});c.exports=j}),define("ikj/grid/1.4.0/grid.css",[],function(){seajs.importStyle('@charset "UTF-8";.oneline,.hd,.panel-hd,.grid-hd,.grid-cell{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mod,.hd,.panel-hd,.grid-hd,.bd,.panel-bd,.grid-bd,.panel-mod{position:relative;overflow:hidden}.panel-mod{margin-bottom:10px}.panel-hd{background-color:#307ecc;color:#FFF;font-size:14px;line-height:38px;padding-left:12px}.panel-bd{border:1px solid #ddd;background:#eff3f8}.grid-hd table,.grid-view table{table-layout:fixed;width:100%}.grid-hd th,.grid-view th{padding:0}.grid-hd{_width:100%;color:#707070;background:#f2f2f2;background:-webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#f8f8f8),color-stop(100%,#ececec));background:-webkit-linear-gradient(top,#f8f8f8,#ececec);background:-moz-linear-gradient(top,#f8f8f8,#ececec);background:-o-linear-gradient(top,#f8f8f8,#ececec);background:linear-gradient(top,#f8f8f8,#ececec)}.grid-hd .grid-cell{font-weight:700;border-bottom:1px solid #ddd}.grid-hd table{height:30px}.grid-bd{background:#fff}.grid-view{overflow:auto;_width:100%;height:100%}.grid-row{height:21px}.grid-row:hover{background-color:#efefef}.grid-row-alt{background-color:#fafafa}.grid-row-is-selected,.grid-row-is-selected:hover{background-color:#dfe8f6}.grid-cell{padding:0 4px;border-width:0 1px 1px 0;border-style:dotted;border-color:#c5c5c5}.grid-mark-cell{background-color:#e3e4e6;text-align:center;border-bottom-style:solid}.grid-mark-cell input{margin:0}.grid-detail-cell{border-right-width:0}.grid-is-sortable,.grid-is-desc,.grid-is-asc{cursor:pointer}.grid-is-sortable:hover,.grid-is-desc:hover,.grid-is-asc:hover{color:#547ea8}.grid-is-desc,.grid-is-asc{color:#307ecc;background-color:#eaeef4;background:-webkit-gradient(linear,50% 0,50% 100%,color-stop(0%,#eff3f8),color-stop(100%,#e3e7ed));background:-webkit-linear-gradient(top,#eff3f8,#e3e7ed);background:-moz-linear-gradient(top,#eff3f8,#e3e7ed);background:-o-linear-gradient(top,#eff3f8,#e3e7ed);background:linear-gradient(top,#eff3f8,#e3e7ed)}.grid-is-sortable:after{content:"\\f0dc";display:inline-block;color:#555;font-family:FontAwesome;font-size:13px;font-weight:400;margin-right:4px;position:relative}.grid-is-asc:after{content:"\\f0de";top:4px;color:#307ecc}.grid-is-desc:after{content:"\\f0dd";top:-3px;color:#307ecc}.icon-grid-page-first,.icon-grid-page-last,.icon-grid-page-next,.icon-grid-page-prev{width:18px;height:18px;line-height:18px;text-align:center;margin:0 2px;border-radius:100%;color:gray;border:1px solid #ccc;background-color:#fff;cursor:pointer}.icon-grid-page-first:hover,.icon-grid-page-last:hover,.icon-grid-page-next:hover,.icon-grid-page-prev:hover{color:#699ab5;border-color:#699ab5}.icon-grid-page-first:before,.icon-grid-page-last:before,.icon-grid-page-next:before,.icon-grid-page-prev:before{color:gray}.icon-grid-page-first-disabled,.icon-grid-page-last-disabled,.icon-grid-page-next-disabled,.icon-grid-page-prev-disabled{width:18px;height:18px;line-height:18px;text-align:center;margin:0 2px;border-radius:100%;color:#b0b0b0;border:1px solid #ddd;background-color:#f7f7f7}.icon-grid-page-first:before,.icon-grid-page-first-disabled:before{content:"\\f100"}.icon-grid-page-last:before,.icon-grid-page-last-disabled:before{content:"\\f101"}.icon-grid-page-next:before,.icon-grid-page-next-disabled:before{content:"\\f105"}.icon-grid-page-prev:before,.icon-grid-page-prev-disabled:before{content:"\\f104"}.icon-grid-refresh{width:18px;height:18px;line-height:18px;text-align:center;margin:0 2px;border-radius:100%;cursor:pointer;opacity:.85;-webkit-transition:all,.12s;-moz-transition:all,.12s;-o-transition:all,.12s;transition:all,.12s}.icon-grid-refresh:hover{-webkit-transform:scale(1.2);-moz-transform:scale(1.2);-ms-transform:scale(1.2);-o-transform:scale(1.2);transform:scale(1.2);opacity:1}.icon-grid-refresh:before{content:"\\f021";color:#69aa46}.toolbar-text-right{float:right;margin-right:20px}.toolbar-ft{padding-left:10px;line-height:32px;height:32px}.toolbar-ft .input{height:13px;display:inline-block;margin-top:5px;text-align:center}.toolbar-separator{border:1px solid #c9d4db;margin:4px}.panel-mod{width:100%!important}.loading{position:absolute;top:0;width:100%;height:100%;background:#fff;filter:alpha(Opacity=90);opacity:.9;z-index:100}.loading span{position:absolute;top:50%;left:50%;width:80px;height:20px;margin-left:-40px;margin-top:-40px;padding:10px 0;color:#3a87ad;line-height:20px;border:1px solid;text-align:center}.loading span i{margin-right:5px}')}),define("ikj/grid/1.4.0/grid.tpl",[],'<div class="panel-mod" style="width:{{width}}px;">\n  {{#if title}}\n  <div class="panel-hd">\n    <span>{{title}}</span>\n  </div>\n  {{/if}}\n  <div class="panel-bd">\n\n    <div class="grid-hd">\n      <table>\n        <thead>\n          <tr>\n            {{#if needCheckbox}}\n              <th style="width:{{checkboxWidth}}px;"></th>\n            {{/if}}\n            {{#if needOrder}}\n              <th style="width:{{orderWidth}}px;"></th>\n            {{/if}}\n            {{#each fields}}\n              <th style="width:{{width}}px;"></th>\n            {{/each}}\n            <th data-role=scroll style="width:0;"></th>\n          </tr>\n        </thead>\n        <tbody>\n          {{createHeader headers}}\n        </tbody>\n      </table>\n    </div>\n\n    <div class="grid-bd" style="height:{{height}}px;">\n      <div class="grid-view"{{#unless isLong}} style="_overflow-x:hidden;"{{/unless}}>\n        <table>\n          <thead>\n            <tr>\n              {{#if needCheckbox}}\n                <th style="width:{{checkboxWidth}}px;"></th>\n              {{/if}}\n              {{#if needOrder}}\n                <th style="width:{{orderWidth}}px;"></th>\n              {{/if}}\n              {{#each fields}}\n                <th style="width:{{width}}px;"></th>\n              {{/each}}\n            </tr>\n          </thead>\n          <tbody></tbody>\n        </table>\n      </div>\n    </div>\n\n    {{#if paginate}}\n      <div class="toolbar-ft">\n        <span class="toolbar-text-right">共{{totalCount}}条记录，每页{{pageSize}}条</span>\n        <i class="{{#if isFirst}}icon-grid-page-first-disabled{{else}}icon-grid-page-first{{/if}}" data-role="first"></i>\n        <i class="{{#if hasPrev}}icon-grid-page-prev{{else}}icon-grid-page-prev-disabled{{/if}}" data-role="prev"></i>\n        <i class="toolbar-separator"></i>\n        <span class="toolbar-text">当前第</span>\n        <input class="input" style="width:40px;" type="text" data-role="num">\n        <span class="toolbar-text">/{{pageNumbers}}页</span>\n        <i class="toolbar-separator"></i>\n        <i class="{{#if hasNext}}icon-grid-page-next{{else}}icon-grid-page-next-disabled{{/if}}" data-role="next"></i>\n        <i class="{{#if isLast}}icon-grid-page-last-disabled{{else}}icon-grid-page-last{{/if}}" data-role="last"></i>\n        <i class="toolbar-separator"></i>\n        <i class="icon-grid-refresh" data-role="refresh"></i>\n      </div>\n    {{/if}}\n  </div>\n</div>\n'),define("ikj/grid/1.4.0/extraHeaderTd.tpl",[],'{{#if needCheckbox}}\n  <td class="grid-cell" width="{{checkboxWidth}}" style="text-align:center;"{{#if needRowspan}} rowspan="{{rowspan}}"{{/if}}>\n    <input type="checkbox" data-role="checkAll"/>\n  </td>\n{{/if}}\n{{#if needOrder}}\n  <td class="grid-cell" width="{{orderWidth}}" style="text-align:center;"{{#if needRowspan}} rowspan="{{rowspan}}"{{/if}}></td>\n{{/if}}\n'),define("ikj/grid/1.4.0/headerTd.tpl",[],'{{#each headers}}\n  <td class="grid-cell{{addSortClass sort}}{{#if sort}} grid-is-sortable{{/if}}"\n    {{#if name}} data-name="{{name}}"{{/if}}\n    {{#if rowspan}} rowspan="{{rowspan}}"{{/if}}\n    {{#if colspan}} colspan="{{colspan}}" style="text-align:center;"{{/if}}\n    {{#if align}} style="text-align:{{align}};"{{/if}}\n    ><span>{{header}}</span>\n  </td>\n{{/each}}\n'),define("ikj/grid/1.4.0/body.tpl",[],'{{#each records}}\n  <tr class="grid-row{{#if isAlt}} grid-row-alt{{/if}}"{{#if isBlank}} data-role="blank"{{/if}}>\n    {{#if ../needCheckbox}}\n      <td class="grid-cell grid-mark-cell">\n      {{#unless isBlank}}\n        <input type="checkbox" data-role="check"/>\n      {{/unless}}\n      </td>\n    {{/if}}\n    {{#if ../needOrder}}\n      <td class="grid-cell grid-mark-cell">\n        {{order}}\n      </td>\n    {{/if}}\n    {{#each values}}\n      <td class="grid-cell"{{#if align}} style="text-align:{{align}};"{{/if}}>\n        {{{value}}}\n      </td>\n    {{/each}}\n  </tr>\n{{/each}}\n');
