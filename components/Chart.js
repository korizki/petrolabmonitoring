import Chart from "chart.js/auto"
import { useEffect, useState } from 'react'
import $ from 'jquery'

export default function ChartEl(props) {
    const { elName, chartProp } = props
    useEffect(() => {
        if(chartProp !== null){
            // remove and re-create element
            $(`#${elName}`).remove()
            $(`.${elName}`).html(`<canvas id="${elName}" width="auto"></canvas>`)
            setTimeout(() => {
                const myChart = new Chart(document.getElementById(`${elName}`).getContext('2d'), chartProp)
            },500 )
        }
    }, [chartProp])
    return (
        <div className={`shows ${elName}`}>
            <canvas id={elName} width="auto"></canvas>
        </div>
    )
}
// update repo rizki