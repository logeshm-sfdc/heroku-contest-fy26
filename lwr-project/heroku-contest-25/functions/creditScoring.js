//Calculate credit score based on customer profile and rules

exports.calculateCreditScore = async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Missing customerId" });
  }

  // Simulate fetching customer info from a database
  const customerProfile = simulateCustomerProfile(customerId);

  // Now, calculate score based on rules
  let score = 600; // base score

  if (customerProfile.goodLoanHistory) {
    score += 80;
  } else {
    score -= 50;
  }

  score += (5 - customerProfile.numberOfDefaults) * 10; // reward fewer defaults

  if (customerProfile.segment === "premium") {
    score += 40;
  } else if (customerProfile.segment === "standard") {
    score += 20;
  } else {
    score += 0; // risky segment
  }

  // Add some lifestyle randomness (± up to 30 points)
  score += Math.floor(Math.random() * 60) - 30;

  // Ensure score stays between 300 and 850
  score = Math.max(300, Math.min(score, 850));

  return res.status(200).json({
    customerId,
    creditScore: score
  });
};

function simulateCustomerProfile(customerId) {
  // Generate some fake "profile" based on customerId hash
  const hash = [...customerId].reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return {
    goodLoanHistory: hash % 2 === 0,
    numberOfDefaults: hash % 5, // 0 to 4
    segment: (hash % 3 === 0) ? "premium" : (hash % 3 === 1) ? "standard" : "risky"
  };
}
