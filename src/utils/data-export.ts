export interface ChartDataPoint {
  date: string;
  unique: number;
  total: number;
}

export interface StarsDataPoint {
  date: string;
  stars: number;
}

export function convertToCSV(data: ChartDataPoint[], type: 'views' | 'clones'): string {
  if (data.length === 0) {
    return '';
  }

  const headers = type === 'views' 
    ? ['Date', 'Total Views', 'Unique Views']
    : ['Date', 'Total Clones', 'Unique Clones'];

  const csvRows = [
    headers.join(','),
    ...data.map(row => [
      row.date,
      row.total.toString(),
      row.unique.toString()
    ].join(','))
  ];

  return csvRows.join('\n');
}

export function convertStarsToCSV(data: StarsDataPoint[], viewType: 'cumulative' | 'daily'): string {
  if (data.length === 0) {
    return '';
  }

  const headers = ['Date', viewType === 'cumulative' ? 'Cumulative Stars' : 'Daily Stars'];

  const csvRows = [
    headers.join(','),
    ...data.map(row => [
      row.date,
      row.stars.toString()
    ].join(','))
  ];

  return csvRows.join('\n');
}

export function convertToJSON(data: ChartDataPoint[], type: 'views' | 'clones'): string {
  if (data.length === 0) {
    return JSON.stringify([], null, 2);
  }

  const formattedData = data.map(row => ({
    date: row.date,
    [type === 'views' ? 'totalViews' : 'totalClones']: row.total,
    [type === 'views' ? 'uniqueViews' : 'uniqueClones']: row.unique
  }));

  return JSON.stringify(formattedData, null, 2);
}

export function convertStarsToJSON(data: StarsDataPoint[], viewType: 'cumulative' | 'daily'): string {
  if (data.length === 0) {
    return JSON.stringify([], null, 2);
  }

  const formattedData = data.map(row => ({
    date: row.date,
    [viewType === 'cumulative' ? 'cumulativeStars' : 'dailyStars']: row.stars
  }));

  return JSON.stringify(formattedData, null, 2);
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function downloadJSON(jsonContent: string, filename: string): void {
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function generateFilename(
  type: 'views' | 'clones' | 'stars', 
  format: 'csv' | 'json',
  repositoryName?: string,
  startDate?: string,
  endDate?: string,
  viewType?: 'cumulative' | 'daily'
): string {
  const repoPrefix = repositoryName ? `${repositoryName.replace(/[^a-zA-Z0-9-]/g, '-')}-` : '';
  
  let dateRange = '';
  if (startDate && endDate) {
    const start = startDate.split('T')[0];
    const end = endDate.split('T')[0];
    dateRange = start === end ? `-${start}` : `-${start}-to-${end}`;
  } else {
    dateRange = `-${new Date().toISOString().split('T')[0]}`;
  }
  
  const typeWithView = type === 'stars' && viewType ? `${type}-${viewType}` : type;
  
  return `${repoPrefix}${typeWithView}${dateRange}.${format}`;
}

export function exportChartData(
  data: ChartDataPoint[], 
  type: 'views' | 'clones',
  format: 'csv' | 'json',
  repositoryName?: string,
  startDate?: string,
  endDate?: string
): void {
  const filename = generateFilename(type, format, repositoryName, startDate, endDate);
  
  if (format === 'csv') {
    const csvContent = convertToCSV(data, type);
    if (csvContent) {
      downloadCSV(csvContent, filename);
    }
  } else {
    const jsonContent = convertToJSON(data, type);
    downloadJSON(jsonContent, filename);
  }
}

export function exportStarsData(
  data: StarsDataPoint[],
  viewType: 'cumulative' | 'daily',
  format: 'csv' | 'json',
  repositoryName?: string,
  startDate?: string,
  endDate?: string
): void {
  const filename = generateFilename('stars', format, repositoryName, startDate, endDate, viewType);
  
  if (format === 'csv') {
    const csvContent = convertStarsToCSV(data, viewType);
    if (csvContent) {
      downloadCSV(csvContent, filename);
    }
  } else {
    const jsonContent = convertStarsToJSON(data, viewType);
    downloadJSON(jsonContent, filename);
  }
}