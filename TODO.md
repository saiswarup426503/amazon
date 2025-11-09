# TODO: Fix Product Addition Issue

## Tasks
- [x] Add key transformation utilities in server.ts (camelCase to snake_case and vice versa)
- [x] Update GET /api/products route to transform response to camelCase
- [x] Update POST /api/products route to transform request body to snake_case and exclude 'id'
- [x] Update PUT /api/products route to transform request body to snake_case and exclude 'id'
- [x] Modify addProduct in App.tsx to return Promise and handle errors
- [x] Modify updateProduct in App.tsx to return Promise and handle errors
- [x] Update ProductForm.tsx to make onSave async and add error handling in handleSubmit
- [x] Test adding a new product
- [x] Test editing an existing product
- [x] Verify existing products load correctly
