export interface ITheoremEnvironmentParents {
  env: string,
  num: number
}

export interface ITheoremEnvironment {
  name: string,
  print: string,
  counter: number,
  counterName: string,
  isNumbered: boolean,
  lastNumber?: string,
  parentNumber?: string,
  parents?: Array<ITheoremEnvironmentParents>,
  style: string,
  useCounter?: string
}

export interface IEnvironmentsCounter {
  environment: string,
  counter: number
}

export let theoremEnvironments: Array<ITheoremEnvironment>  = [];
export let counterProof = 0;
export let environmentsCounter: Array<IEnvironmentsCounter> = [];

export const addEnvironmentsCounter = (data: IEnvironmentsCounter) => {
  const index = environmentsCounter.findIndex(item => item.environment === data.environment);
  if (index === -1) {
    environmentsCounter.push(data)
  }
};

export const getEnvironmentsCounterIndex = (environment: string) => {
  return environmentsCounter?.length 
    ? environmentsCounter.findIndex(item => item.environment === environment)
    : -1
};

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

export const setCounterTheoremEnvironment = (envName: string, num: number): boolean => {
  const envIndex = envName
    ? getTheoremEnvironmentIndex(envName)
    : -1;
  const counterIndex = getEnvironmentsCounterIndex(envName);
  if (envIndex === -1 || counterIndex === -1) {
    return false;
  }
  const envItem = theoremEnvironments[envIndex];
  envItem.counter = num;
  for (let i = 0; i < theoremEnvironments.length; i++) {
    if (theoremEnvironments[i].name === envName && theoremEnvironments[i].lastNumber) {
      let lastNumberArr = theoremEnvironments[i].lastNumber.split(".");
      theoremEnvironments[i].lastNumber = lastNumberArr?.length > 1
       ? lastNumberArr.slice(0, lastNumberArr.length - 1).join(".") + '.' + num.toString()
        : num.toString();
    }
    if (theoremEnvironments[i].parents?.length) {
      for (let j = 0; j < theoremEnvironments[i].parents.length; j++) {
        let item: ITheoremEnvironmentParents = theoremEnvironments[i].parents[j];
        if (item.env === envName) {
          item.num = num
        }
      }
      theoremEnvironments[i].parentNumber = getParentNumber(theoremEnvironments[i].parents);
    }
  }
  environmentsCounter[counterIndex].counter = num;
  return true;
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

/** Reset global counters for theorems and clear lists storing information about styles and descriptions of theorems */
export const resetTheoremEnvironments = () => {
  theoremEnvironments = [];
  environmentsCounter = [];
  counterProof = 0;
};

const addParentsTheoremEnvironment = (parentsArr: Array<ITheoremEnvironmentParents>, parents: Array<ITheoremEnvironmentParents>) => {
  if (!parentsArr?.length) {
    return parentsArr = parentsArr.concat(parents);
  }
  for (let i = 0; i < parents.length; i++) {
    const parent = parents[i];
    const index = parentsArr.findIndex(item => item.env === parent.env);
    if (index === -1) {
      parentsArr.push(parent);
    } else {
      parentsArr[index].num = parent.num;
    }
  }
  return parentsArr;
};

const getParentNumber = (parentsArr: Array<ITheoremEnvironmentParents>):string => {
  if (!parentsArr || !parentsArr?.length) {
    return ''
  }
  let res = '';
  for (let i = 0; i < parentsArr.length; i++) {
    res += res ? '.' : '';
    res += parentsArr[i].num.toString()
  }
  return res;
};

const getTheoremParentNumber = (counterName: string, env, parentsArr: Array<ITheoremEnvironmentParents>) => {
  let parentNum = "";
  switch (counterName) {
    case "section":
      parentNum = env?.section ? env.section.toString() : "0";
      parentsArr = addParentsTheoremEnvironment(parentsArr, [{ env: "section", num: env?.section ? env?.section : 0 }]);
      break;
    case "subsection":
      parentNum = env?.section ? env.section.toString() : "0";
      parentsArr = addParentsTheoremEnvironment(parentsArr,[{ env: "section", num: env?.section ? env?.section : 0 }]);
      parentNum += ".";
      parentNum += env?.subsection ? env.subsection.toString() : "0";
      parentsArr = addParentsTheoremEnvironment(parentsArr,[{ env: "subsection", num: env?.subsection ? env?.subsection : 0 }]);
      break;
    case "subsubsection":
      parentNum = env?.section ? env.section.toString() : "0";
      parentsArr = addParentsTheoremEnvironment(parentsArr,[{ env: "section", num: env?.section ? env?.section : 0 }]);
      parentNum += ".";
      parentNum += env?.subsection ? env.subsection.toString() : "0";
      parentsArr = addParentsTheoremEnvironment(parentsArr,[{ env: "subsection", num: env?.subsection ? env?.subsection : 0 }]);
      parentNum += ".";
      parentNum += env?.subsubsection ? env.subsubsection.toString() : "0";
      parentsArr = addParentsTheoremEnvironment(parentsArr,[{ env: "subsubsection", num: env?.subsubsection ? env?.subsubsection : 0 }]);
      break;
  }

  if (!parentNum) {
    /** Find new env */
    let counterItem = getTheoremEnvironment(counterName);
    let num = "";
    let numRes = "";
    numRes += counterItem?.hasOwnProperty("lastNumber") 
      ? "" : numRes ? ".0" : "0";
    let arr = [];
    
    if (!counterItem || !counterItem.isNumbered) {
      return {
        parentNum: parentNum,
        parentsArr: parentsArr,
        isNotFoundCounter: true
      }
    }
    
    if (!counterItem.counterName) {
      parentsArr = addParentsTheoremEnvironment(parentsArr,[{
        env: counterItem.name,
        num: counterItem?.counter ? counterItem?.counter : 0
      }]);
      return {
        parentNum: (counterItem?.counter ? counterItem?.counter : 0).toString(),
        parentsArr: parentsArr,
        isNotFoundCounter: false
      }
    }
    
    if (counterItem && counterItem.counterName) {
      parentsArr = addParentsTheoremEnvironment(parentsArr, [...counterItem.parents]);
    }
    while (counterItem && counterItem.counterName && !num) {
      if (counterItem.hasOwnProperty("lastNumber")) {
        num = counterItem.lastNumber;
        parentsArr = addParentsTheoremEnvironment(parentsArr,[{
          env: counterItem.name,
          num: counterItem?.counter ? counterItem?.counter : 0
        }]);
      } else {
        numRes += numRes ? ".0" : "0";
        arr.push("0");
        parentsArr = addParentsTheoremEnvironment(parentsArr,[{
          env: counterItem.name,
          num: 0
        }]);
        const data = getTheoremParentNumber(counterItem.counterName, env, [...counterItem.parents]);
        parentsArr = addParentsTheoremEnvironment(parentsArr, [...data.parentsArr]);
        num = data.parentNum;
        if (data.isNotFoundCounter) {
          break;
        }
      }
    }
    parentNum = arr?.length ? num + '.' + arr.join(".") : num;
  }
  return {
    parentNum: parentNum,
    parentsArr: parentsArr,
    isNotFoundCounter: false
  }
};

export const getTheoremNumber = (envIndex: number, env): string => {
  let envItem: ITheoremEnvironment = theoremEnvironments[envIndex];
  if (!envItem || !envItem.isNumbered) {
    return "";
  }
  if (envItem.useCounter) {
    const envIndexP = getTheoremEnvironmentIndex(envItem.useCounter);
    const envItemP = theoremEnvironments[envIndexP];
    if (envItemP && envItemP.isNumbered) {
      const data = getTheoremParentNumber(envItemP.counterName, env, [...envItemP.parents]);
      let parentNum = getParentNumber(data.parentsArr);
      const indexCounter = getEnvironmentsCounterIndex(envItem.useCounter);

      if (parentNum) {
        envItem.parents = data.parentsArr;
        envItem.parentNumber = parentNum;
        environmentsCounter[indexCounter].counter += 1;
        envItem.counter = environmentsCounter[indexCounter].counter;
        envItem.lastNumber = envItem.parentNumber + '.' + envItem.counter.toString();

        envItemP.counter = envItem.counter;
        envItemP.lastNumber = envItem.lastNumber;
        envItemP.parents = envItem.parents;
        envItemP.parentNumber = envItem.parentNumber;

        return envItem.lastNumber;
      }
    }
  } 
    
  if (envItem.counterName) {
    let data = getTheoremParentNumber(envItem.counterName, env, [...envItem.parents]);
    let parentNum = getParentNumber(data.parentsArr);
    const indexCounter = getEnvironmentsCounterIndex(envItem.name);
    if (parentNum) {
      if (envItem.parentNumber !== parentNum) {
        envItem.parents = data.parentsArr;
        envItem.parentNumber = parentNum;
        environmentsCounter[indexCounter].counter = 1;
      } else {
        environmentsCounter[indexCounter].counter += 1;
      }
      envItem.counter = environmentsCounter[indexCounter].counter;
      envItem.lastNumber = envItem.parentNumber + '.' + envItem.counter.toString();
      return envItem.lastNumber;
    }
    if (indexCounter !== -1) {
      environmentsCounter[indexCounter].counter += 1;
      envItem.counter = environmentsCounter[indexCounter].counter;
      envItem.lastNumber = envItem.counter.toString();
      return envItem.lastNumber;
    }
  }
  const indexCounter = getEnvironmentsCounterIndex(envItem.name);
  if (indexCounter !== -1) {
    environmentsCounter[indexCounter].counter += 1;
  }
  envItem.counter += 1;
  envItem.lastNumber = envItem.counter.toString();
  return envItem.lastNumber;
};
