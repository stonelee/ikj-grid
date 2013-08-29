seajs.use(['$', '../src/grid'], function($, Grid) {

  var fields = [{
      header: '编号',
      name: 'id',
      align: 'center',
      sort: true
    }, {
      header: '验票站名称',
      name: 'stationName',
      width: 150
    }, {
      header: '车牌号',
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

  new Grid({
    url: 'grid_1.json',
    urlParser: /(grid_)\d+(.*)/,
    model: {
      fields: fields,
      title: 'title',
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
      title: 'title',
      height: 190
    }
  }).render();
});
