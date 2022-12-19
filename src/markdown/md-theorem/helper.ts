export interface ITheoremEnvironment {
  name: string,
  print: string,
  counter: number,
  counterName: string,
  isNumbered: boolean,
  lastNumber?: string,
  parentNumber?: string,
  style: string
}

export let theoremEnvironments: Array<ITheoremEnvironment>  = [];
export let envNumbers = [];
export let counterProof = 0;

export const getNextCounterProof = () => {
  counterProof += 1;
  return counterProof;
};

export const addTheoremEnvironment = (data: ITheoremEnvironment) => {
  const index = theoremEnvironments.findIndex(item => item.name === data.name);
  if (index === -1) {
    theoremEnvironments.push(data)
  }
};

export const getTheoremEnvironment = (name: string) => {
  return theoremEnvironments?.length
    ? theoremEnvironments.find(item => item.name === name)
    : null;
};

export const getTheoremEnvironmentIndex = (name: string) => {
  return theoremEnvironments?.length
    ? theoremEnvironments.findIndex(item => item.name === name)
    : -1;
};

export const resetTheoremEnvironments = () => {
  theoremEnvironments = [];
};

export const getTheoremNumberByLabel = (envLabel: string) => {
  const index = envNumbers.findIndex(item => item.label === envLabel);
  if (index === -1) {
    return '';
  }
  return envNumbers[index].number;
};

export const getTheoremNumber = (envIndex: number, env): string => {
  const envItem: ITheoremEnvironment = theoremEnvironments[envIndex];
  if (!envItem || !envItem.isNumbered) {
    return "";
  }
  if (envItem.counterName) {
    let parentNum = "";
    switch (envItem.counterName) {
      case "section":
        parentNum = env?.section ? env.section.toString() : "0";
        break;
      case "subsection":
        parentNum = env?.section ? env.section.toString() : "0";
        parentNum += ".";
        parentNum += env?.subsection ? env.subsection.toString() : "0";
        break;
      case "subsubsection":
        parentNum = env?.section ? env.section.toString() : "0";
        parentNum += ".";
        parentNum += env?.subsection ? env.subsection.toString() : "0";
        parentNum += ".";
        parentNum += env?.subsubsection ? env.subsubsection.toString() : "0";
        break;
    }
    if (!parentNum) {
      /** Find new env */
      const counterItem = getTheoremEnvironment(envItem.counterName);
      if (counterItem) {
        parentNum = counterItem.lastNumber;
      }
    }
    if (parentNum) {
      if (envItem.parentNumber !== parentNum) {
        envItem.parentNumber = parentNum;
        envItem.counter = 1;
      } else {
        envItem.counter += 1;
      }
      envItem.lastNumber = envItem.parentNumber + '.' + envItem.counter.toString();
      return envItem.lastNumber;
    }
  }
  envItem.counter += 1;
  envItem.lastNumber = envItem.counter.toString();
  return envItem.lastNumber;
};
