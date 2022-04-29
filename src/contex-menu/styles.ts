export const menuStyle = () => {
  return `
  .mmd-menu {
    max-width: 320px;
    position: absolute;
    background-color: white;
    color: black;
    width: auto;
    padding: 5px 0px;
    border: 1px solid #CCCCCC;
    margin: 0;
    cursor: default;
    font: menu;
    text-align: left;
    text-indent: 0;
    text-transform: none;
    line-height: normal;
    letter-spacing: normal;
    word-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    float: none;
    z-index: 201;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -khtml-border-radius: 5px;
    box-shadow: 0px 10px 20px #808080;
    -webkit-box-shadow: 0px 10px 20px #808080;
    -moz-box-shadow: 0px 10px 20px #808080;
    -khtml-box-shadow: 0px 10px 20px #808080; 
  }

  .mmd-menu-item-icon {
    color: #1e2029;
    margin-left: auto;
    align-items: center;
    display: flex;
    flex-shrink: 0;
    display: none; 
  }

  .mmd-menu-item {
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    display: flex;
    background: transparent; 
  }

  .mmd-menu-item.active {
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    background-color: #e1e0e5; 
  }

  .mmd-menu-item.active .mmd-menu-item-icon {
    display: flex; 
  }

  .mmd-menu-item-container {
    overflow: hidden; 
  }

  .mmd-menu-item-title {
    color: #1e2029;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: .875rem;
    line-height: 1.25rem; 
  }

  .mmd-menu-item-value {
    color: #7d829c;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: .75rem;
    line-height: 1rem; 
  }
  
  html[data-theme="dark"] .mmd-menu-item-title {
    color: #ebefe7;
  } 
  html[data-theme="dark"] .mmd-menu-item.active .mmd-menu-item-title {
    color: #1e2029;
  }
  html[data-theme="dark"] .mmd-menu {
    background-color: #33363a;
  }
  `
};
