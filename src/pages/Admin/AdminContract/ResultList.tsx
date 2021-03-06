//计费明细表 
import { Card, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';
// import styles from './style.less';

interface ResultListProps {
  chargeData: any[];//费用明细
  className: any;
}

function ResultList(props: ResultListProps) {
  const { chargeData, className } = props;
  const columns = [
    {
      title: '区间',
      width: 100,
      render: (text, row, index) => {
        // return moment(row.beginDate).format('YYYY-MM-DD') + " - " + moment(row.endDate).format('YYYY-MM-DD'); 
        if (row.isReduction)
          return <span>{moment(row.beginDate).format('YYYY-MM-DD') + " - " + moment(row.endDate).format('YYYY-MM-DD') + ' '}<span style={{ color: 'red', fontSize: '4px', verticalAlign: 'super' }}>免</span></span>;
        else
          return moment(row.beginDate).format('YYYY-MM-DD') + " - " + moment(row.endDate).format('YYYY-MM-DD'); 
      }
    },
    {
      title: '费用类型',
      dataIndex: 'feeItemName',
      key: 'feeItemName',
      width: 120,
    },
    {
      title: '付款日',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 60,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '最终单价',
      width: 60,
      render: (text, row, index) => {

        return row.price + row.priceUnit;

        // let unit = '';
        // if (row.priceUnit == "1")
        //   unit = '元/m²·月';
        // else if (row.priceUnit == "2")
        //   unit = '元/m²·天';
        // else if (row.priceUnit == "3")
        //   unit = '元/月';
        // else
        //   unit = '元/天';

        // if (row.price)
        //   return row.price + unit;
        // else
        //   return '';
      }
    },
    {
      title: '金额',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 60,
    }
  ] as ColumnProps<any>[];

  return (
    <div>


      <Card title="费用" className={className} hoverable>
        <Table
          style={{ border: 'none' }}
          bordered={false}
          size="middle"
          columns={columns}
          dataSource={chargeData}
        />
      </Card>
    </div>
  );
}

export default ResultList;
