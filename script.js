const tableKey = "cms-table";

let clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", () => {
  localStorage.removeItem(tableKey);
});

let cmsTable;
let cmsTableDemo = {
  "Bob Pop": {
    phone: "700-700-70000",
    address: "1234 Bob Road, Bobywood, NYC, 12345"
  },
  "Kika Pop": {
    phone: "701-701-70001",
    address: "1234 Kyka Road, Kykawood, NYC, 12900"
  }
};

let init = () => {
  if (localStorage.getItem(tableKey)) {
    cmsTable = JSON.parse(localStorage.getItem(tableKey));
  } else {
    cmsTable = cmsTableDemo;
    localStorage.setItem(tableKey, JSON.stringify(cmsTableDemo));
  }
  refreshDOMTable();
};

let enableDisableNewUserInput = option => {
  let newPersonName = document.getElementById("newPersonName");
  if (option === "disable") newPersonName.disabled = true;
  else if (option === "enable") newPersonName.disabled = false;
};

let deleteUserFromTable = userName => {
  let tempTable = {};
  let cmsTableKeys = Object.keys(cmsTable);

  for (let i = 0; i < cmsTableKeys.length; i++) {
    if (userName !== cmsTableKeys[i])
      tempTable[cmsTableKeys[i]] = cmsTable[cmsTableKeys[i]];
  }
  cmsTable = tempTable;

  localStorage.setItem(tableKey, JSON.stringify(cmsTable));
  refreshDOMTable();
};

let refreshDOMTable = () => {
  let cmsTableKeys = Object.keys(cmsTable);
  let tableContainer = document.getElementById("cmsTableContainer");
  let oldTableBody = document.getElementById("tableBody");
  tableContainer.removeChild(oldTableBody);

  let newTableBody = document.createElement("span");
  newTableBody.id = "tableBody";
  tableContainer.appendChild(newTableBody);

  for (let i = 0; i < cmsTableKeys.length; i++) {
    let currentRow = document.createElement("div");
    let currentNameCol = document.createElement("div");
    let currentPhoneCol = document.createElement("div");
    let currentAddressCol = document.createElement("div");
    let currentDeleteBtn = document.createElement("div");
    let currentEditBtn = document.createElement("div");

    currentRow.className = "cms-table-row";
    currentNameCol.className = "cms-table-column cms-name cms-header";
    currentPhoneCol.className = "cms-table-column cms-phone cms-header";
    currentAddressCol.className = "cms-table-column cms-address cms-header";
    currentDeleteBtn.className = "cms-table-column cms-delete";
    currentEditBtn.className = "cms-table-column cms-edit";

    currentNameCol.innerHTML = cmsTableKeys[i];
    currentPhoneCol.innerHTML = cmsTable[cmsTableKeys[i]].phone;
    currentAddressCol.innerHTML = cmsTable[cmsTableKeys[i]].address;
    currentDeleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
    currentEditBtn.innerHTML = `<i class="fas fa-edit"></i>`;

    currentRow.appendChild(currentNameCol);
    currentRow.appendChild(currentPhoneCol);
    currentRow.appendChild(currentAddressCol);
    currentRow.appendChild(currentDeleteBtn);
    currentRow.appendChild(currentEditBtn);

    newTableBody.appendChild(currentRow);
  }

  let enableDisableNewUserModal = option => {
    let newPersonName = document.getElementById("newPersonName");
    let newPersonPhone = document.getElementById("newPersonPhone");
    let newPersonAddress = document.getElementById("newPersonAddress");
    newPersonName.value = "";
    newPersonPhone.value = "";
    newPersonAddress.value = "";

    let newPersonModal = document.getElementById("newPersonModal");
    let backdrop = document.getElementById("backdrop");
    newPersonModal.className = `${option}-modal`;
    backdrop.className = `${option}-modal`;
  };

  let addNewEntry = document.getElementById("cmsAddNewEntry");
  let deleteBtns = document.getElementsByClassName("cms-delete");
  let editBtns = document.getElementsByClassName("cms-edit");

  let newPersonCancelBtn = document.getElementById("newPersonCancelBtn");
  let newPersonSubmitBtn = document.getElementById("newPersonSubmitBtn");

  newPersonSubmitBtn.addEventListener("click", () => {
    let newPersonName = document.getElementById("newPersonName").value.trim();
    let newPersonPhone = document.getElementById("newPersonPhone").value.trim();
    let newPersonAddress = document
      .getElementById("newPersonAddress")
      .value.trim();

    if (newPersonName === "")
      document.getElementById("newPersonName").className = "input-err";
    else document.getElementById("newPersonName").className = "";
    if (newPersonPhone === "")
      document.getElementById("newPersonPhone").className = "input-err";
    else document.getElementById("newPersonPhone").className = "";
    if (newPersonAddress === "")
      document.getElementById("newPersonAddress").className = "input-err";
    else document.getElementById("newPersonAddress").className = "";
    if (
      newPersonName !== "" &&
      newPersonPhone !== "" &&
      newPersonAddress !== ""
    ) {
      let newPerson = {};
      cmsTable[newPersonName] = {
        phone: newPersonPhone,
        address: newPersonAddress
      };
      localStorage.setItem(tableKey, JSON.stringify(cmsTable));
      enableDisableNewUserModal("disable");
      refreshDOMTable();
    }
  });

  addNewEntry.addEventListener("click", () => {
    enableDisableNewUserModal("enable");
  });

  newPersonCancelBtn.addEventListener("click", () => {
    enableDisableNewUserModal("disable");
  });

  for (let i = 0; i < editBtns.length; i++) {
    editBtns[i].addEventListener("click", $event => {
      let nameToEdit = $event.target.parentNode.children[0].innerHTML;
      let personToEdit = cmsTable[nameToEdit];
      enableDisableNewUserModal("enable");
      let newPersonName = document.getElementById("newPersonName");
      let newPersonPhone = document.getElementById("newPersonPhone");
      let newPersonAddress = document.getElementById("newPersonAddress");
      enableDisableNewUserInput("disable");
      newPersonName.value = nameToEdit;
      newPersonPhone.value = personToEdit.phone;
      newPersonAddress.value = personToEdit.address;
    });
  }

  for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener("click", $event => {
      let nameToDelete = $event.target.parentNode.children[0].innerHTML;
      let isSure = window.confirm(
        `Are you sure to delete ${nameToDelete} from your Book Address?`
      );
      if (isSure) deleteUserFromTable(nameToDelete);
    });
  }
};

init();
