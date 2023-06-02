"use client"
// update ke github
import Image from 'next/image'
import {useState, useEffect} from 'react'
import $ from 'jquery'
import _ from 'lodash'

export default function Home() {
  const [listData, setListData] = useState([])
  const [listPart, setListPart] = useState([])
  const [listEvalCode, setListEvalCode] = useState(['Normal', 'Caution', 'Critical', 'Severe'])
  const [listUnit, setListUnit] = useState([])
  const [listConvertedData, setListConvertedData] = useState([])
  const processData = listData => {
    // set list part dan unit
    let listPart = _.uniq(_.map(listData, 'COMPONENT'))
    let listUnit = _.uniq(_.map(listData, 'SERIAL_NO'))
    setListPart(listPart)
    setListUnit(listUnit)
    // convert data by list unit
    let convertedData = listUnit.map(unit => {
      // create list part info
      let dataPart = listPart.map(part => {
        let allData = listData.filter(data => data.SERIAL_NO == unit && data.COMPONENT == part)
        // sort list report by date , ambil hanya 5 terakhir
        allData = allData.length ? allData.sort((a,b) => new Date(b.updatedate) > new Date(a.updatedate) ? 1 : -1) : false
        return {
          partName: part,
          lastStatus: allData ? allData[0] : 0, 
          allData: allData ? allData.splice(0,5) : [],
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
        highestStatus : highestStatus.sort((a, b) => b > a ? 1 : -1)[0],
        dataPart
      }
    })
    console.log(convertedData)
    setListConvertedData(convertedData)
  }
  useEffect(() => {
    $.ajax({
      url : `https://ut.petrolab.co.id/api/report/last-update?limit=true&page=1&order_by=RECV_DT1 DESC&data_per_age=50&days=7`,
      method: 'GET',
      beforeSend: function(xhr){
        xhr.setRequestHeader("Authorization", `Bearer KjVNJHkIfefaJnkrVZ8J_SUlG6rZo0Om`)
      },
      success: data => {
        setListData(data.data)
      }
    })
  }, [])
  useEffect(() => {
    processData(listData)
  }, [listData])
  return (
    <main>
      <div className="flex justify-between items-center px-10 py-6 bg-slate-50">
        <div className="mb-1">
          <h1 className="text-2xl text-slate-600 font-semibold mb-1"><i className="fa-solid mr-2 fa-file-waveform"></i>  Summary Data</h1>
          <p className="text-sky-700 bg-sky-100 mt-1 p-1 px-2 inline-block rounded"><i className="fa-solid fa-circle-info"></i> Menampilkan Total <strong>{listData.length}</strong> report, <strong>{listPart.length}</strong> Part, dan <strong>{listUnit.length}</strong> Unit</p>
        </div>
        <div className="flex gap-5">
          <img src="/ut.png" width="50" />
          <img src="/ppa.png" width="50" />
        </div>
      </div>
      {/* tabel */}
      <div >
        <table>
          <thead className="top-0 sticky z-[1000]">
            <tr>
              <th>Status</th>
              <th>Unit Code</th>
              <th>Component</th>
              <th>Lab Number (Last) </th>
              <th>Update Date (Last) </th>
              <th>Condition (Last 5) </th>
            </tr>
          </thead>
          <tbody>
            {
              listConvertedData.map((it, index) => (
                <tr key={index}>
                  <td className="text-center">
                    <span className={`py-1 px-2 text-white rounded text-sm ${
                      it.highestStatus == 1 ? 'bg-emerald-700' :
                      it.highestStatus == 2 ? 'bg-orange-500' : 
                      it.highestStatus == 3 ? 'bg-rose-400' : 'bg-rose-700' 
                    }`}>{listEvalCode[it.highestStatus - 1]}</span>
                  </td>
                  <td className="text-center text-lg w-[10em]">{it.unit}</td>
                  {/* column component */}
                  <td className="py-2 w-[20em] relative">
                    {
                      it.dataPart.map((data, index) => (
                        <>
                          <p className={`comphov py-1 my-[0.1em] mx-1`} key={index}>
                            <span className={`py-1 px-2 text-white rounded text-sm ${
                              it.overAllStatus[index] == 'N' ? 'bg-emerald-700' :
                              it.overAllStatus[index] == 'B' ? 'bg-orange-500' : 
                              it.overAllStatus[index] == 'C' ? 'bg-rose-400' : 'bg-rose-700' 
                            }`}>{data.partName}</span>
                            <div className="absolute p-2 px-3 backdrop-blur-lg bg-[rgba(255,255,255,0.3)] border border-slate-200 shadow-sm rounded top-[0] w-[20em]">
                              <p className="mb-3"><span className="block font-semibold text-sky-600">
                                <i className="fa-regular fa-clipboard mr-1"></i> Rekomendasi 1</span><span className="text-slate-500 text-xs">{data.lastStatus.RECOMM1}</span></p>
                              <p><span className="block font-semibold text-sky-600">
                                <i className="fa-regular fa-clipboard mr-1"></i> Rekomendasi 2</span><span className="text-slate-500 text-xs">{data.lastStatus.RECOMM2}</span></p>
                            </div>
                          </p>
                        </>
                      ))
                    }
                  </td>
                  {/* column lab number */}
                  <td className="text-center">
                    {
                      it.dataPart.map((data, index) => (
                        <p className={`py-1 my-[0.1em] mx-1`} key={index}>{data.lastStatus.Lab_No}</p>
                      ))
                    }
                  </td>
                  {/* column last update */}
                  <td className="text-center">
                    {
                      it.dataPart.map((data, index) => (
                        <p className={`py-1 my-[0.1em] mx-1`} key={index}>{data.lastStatus.updatedate}</p>
                      ))
                    }
                  </td>
                  {/* column last 5 condition */}
                  <td className="text-center">
                    {
                      it.dataPart.map((data, index) => (
                        <p className={`py-1 my-[0.1em] mx-1`} key={index}>{data.allData.map((last, index) => (
                          <span title={`Update date : ${last.updatedate}`} key={index}>{last.EVAL_CODE}</span>
                        ))}</p>
                      ))
                    }
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </main>
  )
}
