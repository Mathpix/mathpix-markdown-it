export interface IAsciiData {
  ascii: string,
  ascii_tsv: string,
  ascii_csv: string,
}

export const AddToAsciiData = (data: IAsciiData, arr: Array<string>): IAsciiData => {
  if (arr?.length > 2) {
    data.ascii += arr[0];
    data.ascii_tsv += arr[1];
    data.ascii_csv += arr[2];
    return data;
  }
  data.ascii += arr[0];
  data.ascii_tsv += arr[0];
  data.ascii_csv += arr[0];
  return data;
};
