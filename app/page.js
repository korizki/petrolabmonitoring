"use client"
// update ke github
import Image from 'next/image'
import { useState, useEffect } from 'react'
import $ from 'jquery'
import _ from 'lodash'
import dynamic from 'next/dynamic'
import SummaryChart from '@/components/SummaryChart'
import MainTable from '@/components/MainTable'

export default function Home() {
  const [listData, setListData] = useState([])
  const [listPart, setListPart] = useState([])
  const [listEvalCode, setListEvalCode] = useState(['Normal', 'Caution', 'Critical', 'Severe'])
  const [listUnit, setListUnit] = useState([])
  const [listDataStorage, setListDataStorage] = useState([])
  const [listDataForChartComponent, setListDataForChartComponent] = useState([])
  const [listDisplayedData, setListDisplayedData] = useState([])
  const [overallChartConfig, setOverAllChartConfig] = useState(null)
  const [chartConfigByComponent, setChartConfigByComponent] = useState(null)
  const [filterBy, setFilterBy] = useState('All')
  // reformat data
  const processData = listData => {
    // set list part dan unit
    let listPart = _.uniq(_.map(listData, 'COMPONENT'))
    let listUnit = _.uniq(_.map(listData, 'UNIT_NO'))
    setListPart(listPart)
    setListUnit(listUnit)
    // convert data by list unit
    let convertedData = listUnit.map(unit => {
      // create list part info
      let dataPart = listPart.map(part => {
        let allData = listData.filter(data => data.UNIT_NO == unit && data.COMPONENT == part)
        // sort list report by date , ambil hanya 5 terakhir
        allData = allData.length ? allData.sort((a, b) => new Date(b.updatedate) > new Date(a.updatedate) ? 1 : -1) : false
        return {
          partName: part,
          lastStatus: allData ? allData[0] : 0,
          model: allData ? allData[0].MODEL : '-',
          snUnit: allData ? allData[0].SERIAL_NO : '-',
          eod: allData ? parseInt((new Date() - new Date(allData[0].SAMPL_DT1)) / 1000 / 60 / 60 / 24) : '0',
          hmSample: allData ? allData[0].HRS_KM_TOT : '-',
          dateSample: allData ? allData[0].SAMPL_DT1 : '-',
          dateReport: allData ? allData[0].RPT_DT1 : '-',
          oilHours: allData ? allData[0].HRS_KM_OC : '-',
          lastOil: allData ? allData[0].oil_change : '-',
          allData: allData ? allData.splice(0, 5) : [],
        }
      })
      // filter hanya equipment yang memiliki data
      dataPart = dataPart.filter(it => it.allData.length)
      // convert overall status jadi angka
      let overAllStatus = [...dataPart].map(it => it.lastStatus.EVAL_CODE)
      let highestStatus = [...overAllStatus].map(it => it == 'N' ? 1 : it == 'B' ? 2 : it == 'C' ? 3 : 4)
      return {
        unit,
        overAllStatus,
        highestStatus: highestStatus.sort((a, b) => b > a ? 1 : -1)[0],
        dataPart
      }
    })
    setListDataStorage(convertedData)
  }
  // create chart config for summary pie chart
  const createChartConfig = data => {
    let listConvertedData = data.map(it => it.highestStatus == 1 ? 'Normal' : it.highestStatus == 2 ? 'Caution' : it.highestStatus == 3 ? 'Critical' : 'Severe')
    // get unique labels
    let labels = _.uniq(listConvertedData)
    listConvertedData = labels.map(it => {
      let filtered = listConvertedData.filter(data => data === it)
      return {
        status: it,
        value: filtered.length
      }
    })
    let chartConfig = {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Pencapaian',
            data: listConvertedData.map(it => it.value),
            backgroundColor: listConvertedData.map(it => it.status == 'Normal' ? 'rgb(27, 156, 133)' : 
            it.status == 'Caution' ? 'rgb(255, 184, 76)' :
            it.status == 'Critical' ? 'rgb(255, 105, 105)' : 'rgb(183, 4, 4)'
          )
          }
        ]
      },
      options: {
        responsive: true
      }
    }
    setOverAllChartConfig(chartConfig)
  }
  // create chart config for pie chart by component
  const createChartConfigComponent = data => {
    let newArrData = []
    data.forEach(it => it.dataPart.forEach(data => data.allData.forEach(rep => newArrData.push(rep))))
    // create new format
    let listStatus = _.uniq(_.map([...newArrData], 'EVAL_CODE'))
    listStatus = listStatus.map(it => {
      let filtered = newArrData.filter(data => data.EVAL_CODE == it)
      return {
        status: it,
        value: filtered.length
      }
    })
    // create chart
    setChartConfigByComponent({
      type: 'pie',
      data: {
        labels: listStatus.map(it => it.status == 'N' ? 'Normal' :
          it.status == 'B' ? 'Caution' : 
          it.status == 'C' ? 'Critical' : 'Severe' 
        ),
        datasets: [
          {
            label: 'Pencapaian',
            data: _.map(listStatus, 'value'),
            backgroundColor: listStatus.map(it => it.status == 'N' ? 'rgb(27, 156, 133)' : 
              it.status == 'B' ? 'rgb(255, 184, 76)' :
              it.status == 'C' ? 'rgb(255, 105, 105)' : 'rgb(183, 4, 4)'
            )
          }
        ]
      },
      options: {
        responsive: true
      }
    })
  }
  // update data preview with filter
  useEffect(() => {
    let listData = listDataStorage
    let sortIndex = 0
    // filter by overall status
    if(filterBy == 'Normal') {
      sortIndex = 1 
    } else if(filterBy == 'Caution') {
      sortIndex = 2
    } else if(filterBy == 'Critical') {
      sortIndex = 3
    } else if(filterBy == 'Severe') {
      sortIndex = 4
    }
    listData = filterBy != 'All' ? listData.filter(it => it.highestStatus == sortIndex) : listDataStorage
    // jika filter by component status
    const filterByComponent = (data, code) => {
      let filteredUnit = data.filter(unit => {
        // filter berdasarkan status komponen terakhir
        let filteredByStatus = unit.dataPart.filter(it => it.allData[0].EVAL_CODE == code)
        return filteredByStatus.length ? true : false 
      })
      return filteredUnit
    }
    if(filterBy == 'componentNormal'){
      listData = filterByComponent(listDataStorage, 'N')
    } else if(filterBy == 'componentCaution'){
      listData = filterByComponent(listDataStorage, 'B')
    } else if(filterBy == 'componentCritical'){
      listData = filterByComponent(listDataStorage, 'C')
    } else if(filterBy == 'componentSevere'){
      listData = filterByComponent(listDataStorage, 'D')
    } 
    // tampilkan data setelah di filter by overall status
    setListDisplayedData(listData)
  }, [listDataStorage, filterBy])
  // show pie chart
  useEffect(() => {
    createChartConfig(listDataStorage)
    createChartConfigComponent(listDataStorage)
  }, [listDataStorage])
  // get data from endpoint on first load
  useEffect(() => {
    $.ajax({
      url: `https://ut.petrolab.co.id/api/report?limit=true&page=1&data_per_page=500&order_by=RECV_DT1 DESC`,
      method: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", `Bearer KjVNJHkIfefaJnkrVZ8J_SUlG6rZo0Om`)
      },
      success: data => {
        setListData(data.data)
      }
    })
  }, [])
  // auto focus
  useEffect(() => {
    if(filterBy == 'All'){
      window.location.href="#"
    } else {
      window.location.href="#maintable"
    }
  }, [filterBy])
  // on update listdata continue process to new format
  useEffect(() => {
    processData(listData)
  }, [listData])
  return (
    <main>
      <div className="flex justify-between items-center px-10 py-6 bg-slate-50">
        <div className="mb-1">
          <h1 className="text-2xl text-slate-600 font-semibold mb-1"><i className="fa-solid mr-2 fa-file-waveform"></i>  Oil Sample Report - Petrolab</h1>
          <p className="text-sky-700 bg-sky-100 mt-1 p-1 px-2 inline-block rounded"><i className="fa-solid fa-circle-info"></i> Menampilkan Total <strong>{listData.length}</strong> report, <strong>{listPart.length}</strong> Part, dan <strong>{listUnit.length}</strong> Unit</p>
        </div>
        <div className="flex gap-5">
          <img src="/ppa.png" width="50" />
        </div>
      </div>
      {/* chart */}
      <SummaryChart 
        listDataStorage={listDataStorage} 
        overallChartConfig={overallChartConfig}
        chartConfigByComponent={chartConfigByComponent}
        listDataForChartComponent={listDataForChartComponent}
        filterBy={filterBy} 
        listDisplayedData={listDisplayedData}
        setFilterBy={setFilterBy}
      />
      {/* tabel */}
      <div id="maintable">
        {
          listDisplayedData.length ? (
            <MainTable 
              listDisplayedData={listDisplayedData}
              listEvalCode={listEvalCode}
            />
          ) : (
            <h1 colSpan="12" className='text-center text-lg mt-5 text-rose-600 font-semibold'><i className="fas fa-info-circle mr-2"></i> No data found.</h1>
              
          )
        }
      </div>
    </main>
  )
}
