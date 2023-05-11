export interface IAsciiData {
  ascii: string,
  ascii_tsv: string,
  ascii_csv: string,
  ascii_md: string,
}

export const AddToAsciiData = (data: IAsciiData, arr: Array<string>): IAsciiData => {
  if (arr?.length > 3) {
    data.ascii += arr[0];
    data.ascii_tsv += arr[1];
    data.ascii_csv += arr[2];
    data.ascii_md += arr[3];
    return data;
  }
  data.ascii += arr[0];
  data.ascii_tsv += arr[0];
  data.ascii_csv += arr[0];
  data.ascii_md += arr[0];
  return data;
};
