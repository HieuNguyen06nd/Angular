// Thêm đoạn này vào đầu script.js
function initCRUD() {
	const modalHTML = `
	  <div id="crud-modal" class="modal">
		<div class="modal-content">
		  <span class="close">&times;</span>
		  <h3 class="modal-title"></h3>
		  <form id="crud-form" class="modal-form"></form>
		  <div class="form-actions">
			<button type="button" class="btn btn-cancel">Cancel</button>
			<button type="submit" form="crud-form" class="btn btn-primary">Save</button>
		  </div>
		</div>
	  </div>
	`;
	
	document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
  
  // Gọi hàm khởi tạo modal
  initCRUD();



const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})







const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

// 
// Thêm vào script.js
const mockData = {
	brands: [],
	products: [],
	// ... thêm các loại dữ liệu khác
  };
  
  document.addEventListener('click', function(e) {
	const btn = e.target.closest('[data-crud]');
	if (!btn) return;
  
	const action = btn.dataset.crud;
	const entity = btn.dataset.entity;
	const id = btn.dataset.id;
  
	switch(action) {
	  case 'add':
		showModal('Add New', entity);
		break;
	  case 'edit':
		const data = mockData[entity].find(item => item.id === id);
		showModal('Edit', entity, data);
		break;
	  case 'delete':
		handleDelete(entity, id);
		break;
	}
  });
  
  function showModal(title, entity, data = null) {
	const modal = document.getElementById('crud-modal');
	const form = document.getElementById('crud-form');
	
	modal.querySelector('.modal-title').textContent = `${title} ${entity}`;
	form.innerHTML = generateFormFields(entity, data);
	
	modal.style.display = 'block';
	
	// Close handlers
	modal.querySelector('.close').onclick = () => modal.style.display = 'none';
	modal.querySelector('.btn-cancel').onclick = () => modal.style.display = 'none';
	
	form.onsubmit = (e) => {
	  e.preventDefault();
	  handleSubmit(entity, data?.id);
	  modal.style.display = 'none';
	};
  }
  
  function generateFormFields(entity, data) {
	const fields = {
	  brand: [
		{ name: 'name', label: 'Brand Name', type: 'text', required: true },
		{ name: 'description', label: 'Description', type: 'textarea' }
	  ],
	  product: [
		{ name: 'name', label: 'Product Name', type: 'text', required: true },
		{ name: 'price', label: 'Price', type: 'number' },
		{ name: 'category', label: 'Category', type: 'select', options: ['Shoes', 'Clothing'] }
	  ]
	  // ... thêm các entity khác
	};
  
	return fields[entity].map(field => `
	  <div class="form-group">
		<label>${field.label}</label>
		${generateInput(field, data)}
	  </div>
	`).join('');
  }
  
  function generateInput(field, data) {
	const value = data?.[field.name] || '';
	switch(field.type) {
	  case 'select':
		return `
		  <select name="${field.name}" ${field.required ? 'required' : ''}>
			${field.options.map(opt => `
			  <option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>
			`).join('')}
		  </select>
		`;
	  case 'textarea':
		return `<textarea name="${field.name}" ${field.required ? 'required' : ''}>${value}</textarea>`;
	  default:
		return `<input type="${field.type}" name="${field.name}" value="${value}" ${field.required ? 'required' : ''}>`;
	}
  }
  
  function handleSubmit(entity, id) {
	const formData = new FormData(document.getElementById('crud-form'));
	const data = Object.fromEntries(formData.entries());
	
	if (id) {
	  // Edit existing
	  const index = mockData[entity].findIndex(item => item.id === id);
	  mockData[entity][index] = { ...data, id };
	} else {
	  // Add new
	  mockData[entity].push({ ...data, id: Date.now().toString() });
	}
	
	// Update UI
	document.dispatchEvent(new CustomEvent('data-updated', { detail: entity }));
  }
  
  function handleDelete(entity, id) {
	if (!confirm('Are you sure you want to delete this item?')) return;
	
	mockData[entity] = mockData[entity].filter(item => item.id !== id);
	document.dispatchEvent(new CustomEvent('data-updated', { detail: entity }));
  }
  
  // Listen for data updates
  document.addEventListener('data-updated', function(e) {
	const entity = e.detail;
	// Implement your UI update logic here
	console.log(`${entity} data updated:`, mockData[entity]);
  });



  // Thêm vào script.js sau khi load data
function renderTable(entity, containerId) {
	const container = document.querySelector(`#${containerId} tbody`);
	container.innerHTML = mockData[entity].map(item => `
	  <tr>
		<td>${item.name}</td>
		<td>${item.description}</td>
		<!-- ... các cột khác -->
		<td>
		  <button class="btn-icon" data-crud="edit" data-entity="${entity}" data-id="${item.id}">
			<i class="fas fa-edit"></i>
		  </button>
		  <button class="btn-icon" data-crud="delete" data-entity="${entity}" data-id="${item.id}">
			<i class="fas fa-trash"></i>
		  </button>
		</td>
	  </tr>
	`).join('');
  }
  
  // Ví dụ cho brands
  document.addEventListener('data-updated', function(e) {
	if (e.detail === 'brand') {
	  renderTable('brand', 'brand-table');
	}
  });