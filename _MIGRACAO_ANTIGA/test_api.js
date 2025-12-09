const API_URL = 'http://localhost:3001/api/auth';
const ADMIN_EMAIL = 'msgsilva.estagio@mpmg.mp.br';
const ADMIN_PASSWORD = '86076448';

async function testUserManagement() {
    try {
        // 1. Login
        console.log('1. Logging in...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful. Token obtained.');

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // 2. Create User
        console.log('\n2. Creating new user...');
        const newUser = {
            email: 'test_api_user@mp.br',
            usuario: 'Test API User',
            cargo: 'Técnica(o)',
            area: 'Direito',
            role: 'User'
        };
        const createRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newUser)
        });

        if (!createRes.ok) {
            const err = await createRes.json();
            throw new Error(`Create failed: ${JSON.stringify(err)}`);
        }
        const createData = await createRes.json();
        console.log('User created:', createData);
        const newUserId = createData.id;

        // 3. List Users
        console.log('\n3. Listing users...');
        const listRes = await fetch(`${API_URL}/users`, { headers: headers });
        const listData = await listRes.json();
        const createdUser = listData.find(u => u.id === newUserId);
        console.log('Found created user in list:', createdUser);

        if (!createdUser || createdUser.area !== 'Direito' || createdUser.role !== 'User') {
            throw new Error('User creation verification failed');
        }

        // 4. Update User
        console.log('\n4. Updating user...');
        const updateData = {
            email: 'test_api_user_updated@mp.br',
            usuario: 'Test API User Updated',
            cargo: 'Promotora(o)',
            area: 'Psicossocial',
            role: 'Admin'
        };
        const updateRes = await fetch(`${API_URL}/users/${newUserId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updateData)
        });

        if (!updateRes.ok) {
            const err = await updateRes.json();
            throw new Error(`Update failed: ${JSON.stringify(err)}`);
        }
        const updateResData = await updateRes.json();
        console.log('User updated:', updateResData);

        // 5. Verify Update
        console.log('\n5. Verifying update...');
        const listRes2 = await fetch(`${API_URL}/users`, { headers: headers });
        const listData2 = await listRes2.json();
        const updatedUserInList = listData2.find(u => u.id === newUserId);
        console.log('Found updated user in list:', updatedUserInList);

        if (updatedUserInList.area !== 'Psicossocial' || updatedUserInList.role !== 'Admin') {
            throw new Error('User update verification failed');
        }

        // 6. Delete User
        console.log('\n6. Deleting user...');
        const deleteRes = await fetch(`${API_URL}/users/${newUserId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!deleteRes.ok) throw new Error('Delete failed');
        console.log('User deleted.');

        console.log('\n✅ ALL TESTS PASSED');

    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
    }
}

testUserManagement();
