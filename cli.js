#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
require('dotenv').config();

const program = new Command();
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

// Path to store token
const TOKEN_PATH = path.join(__dirname, '.token');

// Helper functions
const saveToken = (token) => {
    fs.writeFileSync(TOKEN_PATH, token, 'utf8');
};

const getToken = () => {
    if (fs.existsSync(TOKEN_PATH)) {
        return fs.readFileSync(TOKEN_PATH, 'utf8');
    }
    return null;
};

const deleteToken = () => {
    if (fs.existsSync(TOKEN_PATH)) {
        fs.unlinkSync(TOKEN_PATH);
    }
};

const authHeaders = () => {
    const token = getToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

// Error handling function
const handleError = (error) => {
    if (error.response) {
        console.error(chalk.red('Error:'), error.response.data.error || error.response.data.message);
    } else {
        console.error(chalk.red('Error:'), error.message);
    }
};

// Register Command
program
    .command('register')
    .description('Register a new user')
    .action(async () => {
        try {
            const answers = await inquirer.prompt([
                { type: 'input', name: 'name', message: 'Name:' },
                { type: 'input', name: 'email', message: 'Email:' },
                { type: 'password', name: 'password', message: 'Password:' },
                { type: 'input', name: 'phoneNumber', message: 'Phone Number (E.164 format):' },
            ]);

            const response = await axios.post(`${API_BASE_URL}/auth/register`, answers, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log(chalk.green('Registration Successful!'));
            console.log('User:', response.data.user);
            console.log('Token:', response.data.token);

            saveToken(response.data.token);
        } catch (error) {
            handleError(error);
        }
    });

// Login Command
program
    .command('login')
    .description('Login as an existing user')
    .action(async () => {
        try {
            const answers = await inquirer.prompt([
                { type: 'input', name: 'email', message: 'Email:' },
                { type: 'password', name: 'password', message: 'Password:' },
            ]);

            const response = await axios.post(`${API_BASE_URL}/auth/login`, answers, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log(chalk.green('Login Successful!'));
            console.log('Token:', response.data.token);

            saveToken(response.data.token);
        } catch (error) {
            handleError(error);
        }
    });

// Logout Command
program
    .command('logout')
    .description('Logout the current user')
    .action(() => {
        deleteToken();
        console.log(chalk.green('Logged out successfully!'));
    });

// Items Commands

// List All Items
program
    .command('items')
    .description('List all items')
    .action(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/items`, {
                headers: authHeaders(),
            });
            console.log(chalk.green(`\nTotal Items: ${response.data.count}`));
            response.data.items.forEach(item => {
                console.log(`\nID: ${item._id}`);
                console.log(`Name: ${item.name}`);
                console.log(`Description: ${item.description}`);
                console.log(`Price: ${item.price}`);
                console.log(`Category: ${item.category}`);
                console.log(`Condition: ${item.condition}`);
                console.log(`Status: ${item.status}`);
                console.log(`Seller ID: ${item.sellerId}`);
            });
        } catch (error) {
            handleError(error);
        }
    });

// Get Item by ID
program
    .command('get-item <itemId>')
    .description('Get item details by ID')
    .action(async (itemId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/items/${itemId}`, {
                headers: authHeaders(),
            });
            const item = response.data.item;
            console.log(chalk.green(`\nID: ${item._id}`));
            console.log(`Name: ${item.name}`);
            console.log(`Description: ${item.description}`);
            console.log(`Price: ${item.price}`);
            console.log(`Category: ${item.category}`);
            console.log(`Condition: ${item.condition}`);
            console.log(`Status: ${item.status}`);
            console.log(`Seller ID: ${item.sellerId}`);
        } catch (error) {
            handleError(error);
        }
    });

// Create Item
program
    .command('create-item')
    .description('Create a new item')
    .action(async () => {
        try {
            const answers = await inquirer.prompt([
                { type: 'input', name: 'name', message: 'Item Name:' },
                { type: 'input', name: 'description', message: 'Description:' },
                { type: 'number', name: 'price', message: 'Price:' },
                { type: 'input', name: 'category', message: 'Category:' },
                { type: 'input', name: 'condition', message: 'Condition:' },
            ]);

            const response = await axios.post(`${API_BASE_URL}/items`, answers, {
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders()
                },
            });

            console.log(chalk.green('Item Created Successfully!'));
            console.log('Item:', response.data.item);
        } catch (error) {
            handleError(error);
        }
    });

// Update Item
program
    .command('update-item <itemId>')
    .description('Update an existing item by ID')
    .action(async (itemId) => {
        try {
            const answers = await inquirer.prompt([
                { type: 'input', name: 'name', message: 'Item Name (leave blank to skip):' },
                { type: 'input', name: 'description', message: 'Description (leave blank to skip):' },
                { type: 'input', name: 'price', message: 'Price (leave blank to skip):' },
                { type: 'input', name: 'category', message: 'Category (leave blank to skip):' },
                { type: 'input', name: 'condition', message: 'Condition (leave blank to skip):' },
            ]);

            // 构建有效的 payload
            const payload = {};
            if (answers.name) payload.name = answers.name;
            if (answers.description) payload.description = answers.description;
            if (answers.price) {
                const price = parseFloat(answers.price);
                if (!isNaN(price)) {
                    payload.price = price;
                } else {
                    console.log(chalk.red('Invalid price. Skipping update.'));
                }
            }
            if (answers.category) payload.category = answers.category;
            if (answers.condition) payload.condition = answers.condition;

            if (Object.keys(payload).length === 0) {
                console.log(chalk.yellow('No fields to update.'));
                return;
            }

            // 发起请求
            const response = await axios.patch(`${API_BASE_URL}/items/${itemId}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders(),
                },
            });

            // 成功更新
            console.log(chalk.green('Item Updated Successfully!'));
            console.log('Updated Item:', response.data.item);
        } catch (error) {
            // 捕获和处理错误
            if (error.response && error.response.data) {
                console.error(chalk.red('Error:'), error.response.data.message || error.response.data.error);
            } else {
                console.error(chalk.red('Error:'), error.message);
            }
        }
    });


// Delete Item
program
    .command('delete-item <itemId>')
    .description('Delete an item by ID')
    .action(async (itemId) => {
        try {
            // 发起 DELETE 请求
            const response = await axios.delete(`${API_BASE_URL}/items/${itemId}`, {
                headers: authHeaders(),
            });
            console.log(chalk.green('Item Deleted Successfully!'));
            console.log(`Response: ${response.data}`);
        } catch (error) {
            // 捕获并处理错误
            if (error.response) {
                const statusCode = error.response.status;
                const errorMessage = error.response.data.error || error.response.data.message || 'Unknown error occurred';
                console.error(chalk.red(`Error (${statusCode}): ${errorMessage}`));
            } else {
                console.error(chalk.red(`Request failed: ${error.message}`));
            }
        }
    });


// Messages Commands
program
    .command("messages <receiverId>")
    .description("List all messages with a specific user by receiver ID")
    .action(async (receiverId) => {
        try {
            console.log(chalk.yellow(`Fetching messages with receiverId: ${receiverId}`));

            // 发起请求
            const response = await axios.get(`${API_BASE_URL}/messages/${receiverId}`, {
                headers: authHeaders(),
            });

            const { messages, count } = response.data;

            // 如果没有消息
            if (count === 0) {
                console.log(chalk.yellow("No messages found."));
                return;
            }

            // 打印消息列表
            console.log(chalk.green(`\nTotal Messages: ${count}`));
            messages.forEach((msg, index) => {
                console.log(`\nMessage #${index + 1}`);
                console.log(`From: ${msg.senderId}`);
                console.log(`To: ${msg.receiverId}`);
                console.log(`Content: ${msg.message}`);
                console.log(`Timestamp: ${new Date(msg.timeStamp).toLocaleString()}`);
            });
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;
                const errorMessage = error.response.data.error || error.response.data.message || "Unknown error occurred";
                console.error(chalk.red(`Error (${statusCode}): ${errorMessage}`));
            } else {
                console.error(chalk.red(`Request failed: ${error.message}`));
            }
        }
    });




// Send Message
program
    .command('send-message')
    .description('Send a message to a user')
    .action(async () => {
        try {
            const answers = await inquirer.prompt([
                { type: 'input', name: 'receiverId', message: 'Receiver ID:' },
                { type: 'input', name: 'message', message: 'Message Content:' },
            ]);

            const response = await axios.post(`${API_BASE_URL}/messages`, answers, {
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders()
                },
            });

            console.log(chalk.green('Message Sent Successfully!'));
            console.log('Message:', response.data.message);
        } catch (error) {
            handleError(error);
        }
    });

// Orders Commands

// List Orders for User
program
    .command('orders')
    .description('List all orders for the logged-in user')
    .action(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/orders`, {
                headers: authHeaders(),
            });
            console.log(chalk.green(`\nTotal Orders: ${response.data.count}`));
            response.data.orders.forEach(order => {
                console.log(`\nOrder ID: ${order._id}`);
                console.log(`Buyer ID: ${order.buyerId}`);
                console.log(`Item IDs: ${order.itemIds.join(', ')}`);
                console.log(`Total Amount: ${order.totalAmount}`);
                console.log(`Created At: ${new Date(order.createdAt).toLocaleString()}`);
            });
        } catch (error) {
            handleError(error);
        }
    });

// Create Order
program
    .command('create-order')
    .description('Create a new order')
    .action(async () => {
        try {
            const answers = await inquirer.prompt([
                { type: 'input', name: 'itemIdList', message: 'Enter Item IDs (comma separated):' },
            ]);

            const itemIdList = answers.itemIdList.split(',').map(id => id.trim());

            const response = await axios.post(`${API_BASE_URL}/orders`, { itemIdList }, {
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders()
                },
            });

            console.log(chalk.green('Order Created Successfully!'));
            console.log('Order:', response.data.order);
        } catch (error) {
            handleError(error);
        }
    });

// Parse arguments
program.parse(process.argv);

// If no arguments are provided, show help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
