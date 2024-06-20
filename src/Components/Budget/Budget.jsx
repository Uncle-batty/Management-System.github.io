import React, { useEffect, useState } from 'react';
import './Budget.css';
import { useAuth } from '../../hooks/userAuth';
import { supabase } from '../../Services/supabase';

const Budget = () => {
    const { user } = useAuth();
    const userId = user?.id || '7506ad2b-66ee-4925-b953-4e4fc1b3a37b';

    const [budgetData, setBudgetData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: incomeData, error: incomeError } = await supabase
                    .from('Income')
                    .select('amount')
                    .eq('user_id', userId)
                    .single();
                if (incomeError) throw incomeError;

                const { data: varCostData, error: varCostError } = await supabase
                    .from('VariableCosts')
                    .select('name, amount')
                    .eq('user_id', userId);
                if (varCostError) throw varCostError;

                const { data: fixedCostData, error: fixedCostError } = await supabase
                    .from('FixedCosts')
                    .select('name, amount')
                    .eq('user_id', userId);
                if (fixedCostError) throw fixedCostError;

                const { data: savingsData, error: savingsError } = await supabase
                    .from('Savings')
                    .select('type, percentage')
                    .eq('user_id', userId);
                if (savingsError) throw savingsError;

                const incomeAmount = incomeData?.amount || 0;

                const budget = [
                    {
                        category: 'Income',
                        items: [{ name: 'Salary', budgeted: incomeAmount, actual: 0 }]
                    },
                    {
                        category: 'Variable Costs',
                        items: [
                            { name: 'Accounts', budgeted: varCostData?.find(item => item.name === 'Accounts')?.amount || 0, actual: 0, recommended: incomeAmount * 0.1 },
                            { name: 'Travel', budgeted: varCostData?.find(item => item.name === 'Travel')?.amount || 0, actual: 0, recommended: incomeAmount * 0.15 }
                        ]
                    },
                    {
                        category: 'Fixed Costs',
                        items: [
                            { name: 'Rent', budgeted: fixedCostData?.find(item => item.name === 'Rent')?.amount || 0, actual: 0, recommended: incomeAmount * 0.3 },
                            { name: 'Wifi', budgeted: fixedCostData?.find(item => item.name === 'Wifi')?.amount || 0, actual: 0, recommended: incomeAmount * 0.025 },
                            { name: 'Gym', budgeted: fixedCostData?.find(item => item.name === 'Gym')?.amount || 0, actual: 0, recommended: 0 }
                        ]
                    },
                    {
                        category: 'Savings',
                        items: [
                            { name: 'Long term', budgeted: incomeAmount * (savingsData?.find(item => item.type === 'Long term')?.percentage || 0) / 100, actual: 0, recommended: incomeAmount * 0.2 },
                            { name: 'Emergency', budgeted: incomeAmount * (savingsData?.find(item => item.type === 'Emergency')?.percentage || 0) / 100, actual: 0, recommended: incomeAmount * 0.05 },
                            { name: 'Pension', budgeted: incomeAmount * (savingsData?.find(item => item.type === 'Pension')?.percentage || 0) / 100, actual: 0, recommended: incomeAmount * 0.05 }
                        ]
                    }
                ];

                setBudgetData(budget);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, [userId]);

    const handleTableChange = (categoryIndex, itemIndex, field, value) => {
        const newBudgetData = [...budgetData];
        newBudgetData[categoryIndex].items[itemIndex][field] = parseFloat(value) || 0;
        setBudgetData(newBudgetData);
    };

    const handleTableSave = async (categoryIndex, itemIndex) => {
        const item = budgetData[categoryIndex].items[itemIndex];

        try {
            switch (budgetData[categoryIndex].category) {
                case 'Income':
                    await supabase
                        .from('Income')
                        .update({ amount: item.budgeted })
                        .eq('user_id', userId);
                    break;
                case 'Variable Costs':
                    await supabase
                        .from('VariableCosts')
                        .update({ amount: item.budgeted })
                        .eq('user_id', userId)
                        .eq('name', item.name);
                    break;
                case 'Fixed Costs':
                    await supabase
                        .from('FixedCosts')
                        .update({ amount: item.budgeted })
                        .eq('user_id', userId)
                        .eq('name', item.name);
                    break;
                case 'Savings':
                    const percentage = (item.budgeted / budgetData[0].items[0].budgeted) * 100;
                    await supabase
                        .from('Savings')
                        .update({ percentage })
                        .eq('user_id', userId)
                        .eq('type', item.name);
                    break;
                default:
                    break;
            }
            console.log('Data saved successfully');
        } catch (error) {
            console.error('Error saving data:', error.message);
        }
    };

    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + (item.budgeted || 0), 0);
    };

    const calculateGrandTotal = () => {
        let grandTotal = 0;
        budgetData.forEach((section) => {
            grandTotal += calculateTotal(section.items);
        });
        return grandTotal ;
    };

    return (
        <div className='main'>
            <div className='output-form'>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Recommended</th>
                            <th>Budgeted</th>
                            <th>Actual</th>
                            <th>Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgetData.map((section, sectionIndex) => (
                            <React.Fragment key={sectionIndex}>
                                <tr>
                                    <td colSpan="5"><b>{section.category}</b></td>
                                </tr>
                                {section.items.map((item, itemIndex) => (
                                    <tr key={itemIndex}>
                                        <td>{item.name}</td>
                                        <td>{item.recommended || ''}</td>
                                        <td
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleTableSave(sectionIndex, itemIndex)}
                                            onInput={(e) => handleTableChange(sectionIndex, itemIndex, 'budgeted', e.currentTarget.textContent)}
                                        >
                                            {item.budgeted}
                                        </td>
                                        <td
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleTableSave(sectionIndex, itemIndex)}
                                            onInput={(e) => handleTableChange(sectionIndex, itemIndex, 'actual', e.currentTarget.textContent)}
                                        >
                                            {item.actual}
                                        </td>
                                        <td>{item.budgeted - item.actual}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="4"><b>Total</b></td>
                                    <td>{calculateTotal(section.items)}</td>
                                </tr>
                            </React.Fragment>
                        ))}
                        <tr>
                            <td colSpan="4"><b>Grand Total</b></td>
                            <td>{calculateGrandTotal()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Budget;
