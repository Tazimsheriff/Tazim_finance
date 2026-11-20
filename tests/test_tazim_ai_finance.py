"""
Unit tests for tazim_ai_finance.py
"""

import unittest
from tazim_ai_finance import auto_categorize, detect_anomalies

class TestTazimAIFinance(unittest.TestCase):
    def test_auto_categorize(self):
        cat, tx_type, conf = auto_categorize("AWS Cloud Compute")
        self.assertEqual(cat, "Cloud Infrastructure")
        self.assertEqual(tx_type, "expense")
        self.assertGreaterEqual(conf, 0.9)

        cat2, tx_type2, _ = auto_categorize("Acme Direct Deposit Salary")
        self.assertEqual(cat2, "Salary & Wages")
        self.assertEqual(tx_type2, "income")

    def test_detect_anomalies_duplicate(self):
        txs = [
            {'id': '1', 'merchant': 'Apple Store', 'amount': 249.0, 'type': 'expense'},
            {'id': '2', 'merchant': 'Apple Store', 'amount': 249.0, 'type': 'expense'},
        ]
        anomalies = detect_anomalies(txs)
        self.assertEqual(len(anomalies), 1)
        self.assertEqual(anomalies[0]['type'], 'DUPLICATE_CHARGE')

    def test_detect_anomalies_outlier(self):
        txs = [
            {'id': '1', 'merchant': 'Coffee', 'amount': 4.0, 'type': 'expense'},
            {'id': '2', 'merchant': 'Lunch', 'amount': 12.0, 'type': 'expense'},
            {'id': '3', 'merchant': 'Dinner', 'amount': 18.0, 'type': 'expense'},
            {'id': '4', 'merchant': 'Snack', 'amount': 5.0, 'type': 'expense'},
            {'id': '5', 'merchant': 'Huge Surge Purchase', 'amount': 4500.0, 'type': 'expense', 'is_anomaly': True},
        ]
        anomalies = detect_anomalies(txs)
        self.assertTrue(any(a['type'] == 'STATISTICAL_SPIKE' for a in anomalies))

if __name__ == '__main__':
    unittest.main()
