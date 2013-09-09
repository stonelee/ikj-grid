seajs.use(['$', '../src/grid'], function($, Grid) {

  var fields = [{
      header: '编号',
      name: 'id',
      align: 'center',
      sort: true
    }, {
      header: 'phone隐藏',
      name: 'stationName',
      hidden: 'phone',
      width: 150
    }, {
      header: 'tablet隐藏',
      hidden: 'tablet',
      name: 'licensePlateNumber',
      width: 80
    }, {
      header: '过站时间',
      name: 'transitDate',
      width: 80,
      sort: 'desc',
      render: function(value) {
        return value.split('T')[0];
      }
    }, {
      header: '详细信息',
      name: 'id',
      align: 'center',
      render: function(value) {
        return '<img data-role="detail" src="./application_view_detail.png" width="16" title="详细信息" style="vertical-align:middle;cursor:pointer;">';
      }
    }
  ];

  window.grid = new Grid({
    url: 'grid_1.json',
    urlParser: /(grid_)\d+(.*)/,
    model: {
      fields: fields,
      title: '响应式表格',
      height: 190
    },
    onClick: function(target, data) {
      if (target.attr('data-role') == 'detail') {
        console.log(data);
      }
    },
    onSort: function(name, direction) {
      alert(name + ' ' + direction);
    }
  }).render();

  window.grid2 = new Grid({
    url: './grid_1.json',
    urlParser: /(grid_)\d+(.*)/,
    model: {
      fields: fields,
      title: '序号+多选',
      needCheckbox: true,
      needOrder: true
    },
    onLoaded: function() {
      var self = this;
      var $ft = this.$('.toolbar-ft');
      var $btnSelected = $('<div class="btn btn-small">').html('已选择').appendTo($ft);
      $btnSelected.click(function() {
        console.log(self.selectedData('id'));
      });
    }
  }).render();

  var fields2 = [{
      header: '编号',
      name: 'id',
      width: 80,
      align: 'center'
    }, {
      header: '名称',
      children: [{
          header: '验票站名称',
          name: 'stationName',
          width: 150
        }, {
          header: '矿企名称',
          name: 'mineName',
          width: 100
        }
      ]
    }, {
      header: '信息',
      children: [{
          header: '车牌号',
          name: 'licensePlateNumber',
          width: 180
        }, {
          header: '货物信息',
          children: [{
              header: '矿种',
              name: 'coalType',
              width: 80
            }, {
              header: '毛重',
              name: 'grossWeight',
              width: 80,
              align: 'right',
              render: function(value) {
                return '<b>' + value + '吨</b>';
              }
            }
          ]
        }
      ]
    }, {
      header: '过站时间',
      name: 'transitDate',
      width: 200,
      render: function(value) {
        return value.split('T')[0];
      }
    }, {
      header: '详细信息',
      name: 'id',
      width: 200,
      align: 'center',
      render: function(value) {
        return '<img data-role="detail" src="./application_view_detail.png" width="16" title="详细信息" style="vertical-align:middle;cursor:pointer;">';
      }
    }
  ];

  new Grid({
    url: './grid_1.json',
    urlParser: /(grid_)\d+(.*)/,
    model: {
      fields: fields2,
      title: '复杂表头',
      height: 190
    }
  }).render();

  var fields3 = [{
      header: '编号',
      name: 'id',
      align: 'center'
    }, {
      header: 'name',
      name: 'data',
      width: 80,
      render: function(value) {
        return value.name;
      }
    }
  ];

  new Grid({
    url: 'bug.json',
    urlParser: /(grid_)\d+(.*)/,
    model: {
      fields: fields3,
      title: 'bug测试',
      height: 190
    }
  }).render();
});
