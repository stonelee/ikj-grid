{{#if needCheckbox}}
  <td class="grid-cell" width="{{checkboxWidth}}" style="text-align:center;"{{#if needRowspan}} rowspan="{{rowspan}}"{{/if}}>
    <input type="checkbox" data-role="checkAll"/>
  </td>
{{/if}}
{{#if needOrder}}
  <td class="grid-cell" width="{{orderWidth}}" style="text-align:center;"{{#if needRowspan}} rowspan="{{rowspan}}"{{/if}}></td>
{{/if}}
