const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());

// Simulating external credit score service (could be Experian, Equifax, etc.)
async function getCreditScoreFromExternalService(customerId) {
  // Mocked response, replace with actual API call logic to Experian/Equifax/TransUnion
  // Example: return axios.get(`https://external-service.com/credit-score/${customerId}`);
  return { score: 750, customerId: customerId }; // example response
}

// Endpoint to check a customer's credit score
app.post('/check-credit-score', async (req, res) => {
  try {
    const { customerId } = req.body;
    
    if (!customerId) {
      return res.status(400).send({ error: 'Customer ID is required' });
    }
    
    const creditScoreData = await getCreditScoreFromExternalService(customerId);

    // Simulating the response that Salesforce would expect
    res.json({
      status: 'success',
      creditScore: creditScoreData.score,
      customerId: creditScoreData.customerId,
    });
    
    // You can then send this data to Salesforce using Salesforce API or AppLink
    // Example: sendCreditScoreToSalesforce(creditScoreData);

  } catch (error) {
    console.error('Error checking credit score:', error);
    res.status(500).send({ error: 'An error occurred while checking the credit score.' });
  }
});

// Eventing: Notify Salesforce about credit score changes (real-time updates)
app.post('/credit-score-updated', (req, res) => {
  try {
    const { customerId, newCreditScore } = req.body;
    
    if (!customerId || !newCreditScore) {
      return res.status(400).send({ error: 'Customer ID and new credit score are required' });
    }

    // Here, you'd notify Salesforce via Heroku Eventing
    // Simulate publishing the event to Salesforce
    console.log(`Publishing event to Salesforce: CreditScoreUpdated for customer ${customerId}, new score: ${newCreditScore}`);

    // You can implement your logic here to send an event to Salesforce using a platform event or similar mechanism
    // Example: sendEventToSalesforce(customerId, newCreditScore);

    res.json({ status: 'success', message: 'Credit score updated event published.' });

  } catch (error) {
    console.error('Error publishing credit score update event:', error);
    res.status(500).send({ error: 'An error occurred while publishing the event.' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
