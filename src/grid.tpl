<div class="panel-mod" style="width:{{width}}px;">
  {{#if title}}
  <div class="panel-hd">
    <span>{{title}}</span>
  </div>
  {{/if}}
  <div class="panel-bd">

    <div class="grid-hd">
      <table>
        <thead>
          <tr>
            {{#if needCheckbox}}
              <th style="width:{{checkboxWidth}}px;"></th>
            {{/if}}
            {{#if needOrder}}
              <th style="width:{{orderWidth}}px;"></th>
            {{/if}}
            {{#each fields}}
              <th style="width:{{width}}px;"></th>
            {{/each}}
            <th style="width:18px;"></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {{createHeader headers}}
        </tbody>
      </table>
    </div>

    <div class="grid-bd" style="height:{{height}}px;">
      <div class="grid-view"{{#unless isLong}} style="_overflow-x:hidden;"{{/unless}}>
        <table>
          <thead>
            <tr>
              {{#if needCheckbox}}
                <th style="width:{{checkboxWidth}}px;"></th>
              {{/if}}
              {{#if needOrder}}
                <th style="width:{{orderWidth}}px;"></th>
              {{/if}}
              {{#each fields}}
                <th style="width:{{width}}px;"></th>
              {{/each}}
              <th></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>

    {{#if paginate}}
      <div class="toolbar-ft">
        <span class="toolbar-text-right">共{{totalCount}}条记录，每页{{pageSize}}条</span>
        <i class="{{#if isFirst}}icon-grid-page-first-disabled{{else}}icon-grid-page-first{{/if}}" data-role="first"></i>
        <i class="{{#if hasPrev}}icon-grid-page-prev{{else}}icon-grid-page-prev-disabled{{/if}}" data-role="prev"></i>
        <i class="toolbar-separator"></i>
        <span class="toolbar-text">当前第</span>
        <input class="input" style="width:40px;" type="text" data-role="num">
        <span class="toolbar-text">/{{pageNumbers}}页</span>
        <i class="toolbar-separator"></i>
        <i class="{{#if hasNext}}icon-grid-page-next{{else}}icon-grid-page-next-disabled{{/if}}" data-role="next"></i>
        <i class="{{#if isLast}}icon-grid-page-last-disabled{{else}}icon-grid-page-last{{/if}}" data-role="last"></i>
        <i class="toolbar-separator"></i>
        <i class="icon-grid-refresh" data-role="refresh"></i>
      </div>
    {{/if}}
  </div>
</div>
