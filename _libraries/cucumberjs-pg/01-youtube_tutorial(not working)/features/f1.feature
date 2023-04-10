Feature: feature file
  Scenario: total due amount
    Given I buy a drilling tool worth 200$
    And I buy the plant worth 5$
    Then Total due amount is 205$
