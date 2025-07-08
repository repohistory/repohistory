import { XYChartData, XYData } from "../packages/xy-chart"
import { ChartMode, RepoData } from "../types/chart"
import { getTimeStampByDate } from "./utils"

export const DEFAULT_MAX_REQUEST_AMOUNT = 15

export const convertDataToChartData = (repoData: RepoData[], chartMode: ChartMode): XYChartData => {
  if (chartMode === "Date") {
    const datasets: XYData[] = repoData.map(({ repo, starRecords, logoUrl }) => ({
      label: repo,
      logo: logoUrl,
      data: starRecords.map((item) => {
        return {
          x: new Date(item.date),
          y: Number(item.count)
        }
      })
    }))

    return { datasets }
  } else {
    const datasets: XYData[] = repoData.map(({ repo, starRecords, logoUrl }) => ({
      label: repo,
      logo: logoUrl,
      data: starRecords.map((item) => {
        return {
          x: getTimeStampByDate(new Date(item.date)) - getTimeStampByDate(new Date(starRecords[0].date)),
          y: Number(item.count)
        }
      })
    }))

    return { datasets }
  }
}
