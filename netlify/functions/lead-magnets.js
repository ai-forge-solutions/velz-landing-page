const FIXTURE_PAYLOADS = new Map(Object.entries({
  "test-stockout-token": {
    "version": "inventory_lead_magnet_payload_v1",
    "status": "degraded",
    "tool_key": "stockout_leak_score",
    "brand": {
      "id": "92e18414-055b-4a05-a6f6-5303ee918f9b",
      "name": "Northdeco",
      "domain": "northdeco.com",
      "website_url": "https://northdeco.com"
    },
    "generated_at": "2026-08-05T06:45:00Z",
    "data_freshness": {
      "catalog_scraped_at": "2026-08-05T05:50:00Z",
      "analysis_generated_at": "2026-08-05T05:55:00Z"
    },
    "summary_metrics": {
      "product_count": 405,
      "variant_count": 467,
      "fully_out_of_stock_count": 0,
      "partial_stockout_count": 42,
      "functional_stockout_count": 18,
      "variant_stockout_pct": 13.81,
      "pattern_scope": "mixed",
      "size_curve_applicable": false,
      "sample_size": 467,
      "sample_limitations": [
        "Primary Shopify option values look like colors/materials rather than apparel sizes, so size-curve claims must degrade to variant availability language."
      ]
    },
    "sections": [
      {
        "id": "variant_availability",
        "title": "Variant availability is uneven, but not a true size curve",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Public variant availability is observable in Shopify catalog data."
        },
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "northdeco-analysis-latest",
            "field": "variant_stockout_pct"
          },
          {
            "table": "shopify_signal_items",
            "id": "northdeco-stockout-item-1"
          }
        ],
        "cards": [
          {
            "id": "variant-stockout-pct",
            "title": "13.81% of observed variants were unavailable",
            "body": "This is a catalog availability fact. Because the option set is mostly colors/materials, the payload flags the size-curve interpretation as degraded.",
            "claim_safety": {
              "level": "hard_fact",
              "visibility": "public",
              "rationale": "Computed directly from persisted Shopify variant availability."
            },
            "source_refs": [
              {
                "table": "shopify_signal_analyses",
                "id": "northdeco-analysis-latest",
                "field": "variant_stockout_pct"
              }
            ],
            "metrics": {
              "variant_stockout_pct": 13.81
            }
          },
          {
            "id": "systemic-vs-isolated",
            "title": "Availability pattern looks mixed, not a single isolated SKU",
            "body": "Several products contain unavailable options, but the sample should not be presented as a definitive lost-sales estimate.",
            "claim_safety": {
              "level": "proxy",
              "visibility": "public",
              "rationale": "Systemic-vs-isolated is an assembler inference from multiple public availability records."
            },
            "source_refs": [
              {
                "table": "shopify_signal_items",
                "id": "northdeco-stockout-item-1"
              }
            ],
            "metrics": {
              "pattern_scope": "mixed"
            }
          }
        ]
      }
    ],
    "evidence_items": [
      {
        "id": "northdeco-product-variant-sample",
        "title": "Example product with unavailable options",
        "body": "At least one persisted product/variant sample contains unavailable options in the public catalog snapshot.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Backed by shopify_signal_items and variant source refs."
        },
        "source_refs": [
          {
            "table": "shopify_signal_items",
            "id": "northdeco-stockout-item-1"
          },
          {
            "table": "shopify_variants",
            "id": "northdeco-variant-unavailable-1"
          }
        ],
        "metrics": {
          "available": false
        }
      }
    ],
    "charts": {
      "availability_by_option": {
        "type": "bar",
        "x": "normalized_option",
        "y": "unavailable_variant_count"
      }
    },
    "public_limitations": [
      {
        "code": "size_curve_not_applicable",
        "message": "The detected options behave like colors/materials, so this report avoids apparel size-curve claims and shows variant availability instead.",
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "northdeco-analysis-latest",
            "field": "data_quality_warnings"
          }
        ]
      }
    ],
    "internal_warnings": [
      {
        "code": "option_semantics_ambiguous",
        "message": "Do not render core/peripheral size language for northdeco.com without manual review.",
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "northdeco-analysis-latest"
          }
        ],
        "debug_context": {
          "detected_option_examples": [
            "nogal",
            "roble",
            "negro"
          ]
        }
      }
    ],
    "source_refs": [
      {
        "table": "brands",
        "id": "92e18414-055b-4a05-a6f6-5303ee918f9b"
      },
      {
        "table": "shopify_catalog_scrapes",
        "id": "northdeco-catalog-latest"
      },
      {
        "table": "shopify_signal_analyses",
        "id": "northdeco-analysis-latest"
      },
      {
        "table": "shopify_signal_items",
        "id": "northdeco-stockout-item-1"
      }
    ],
    "stockout": {
      "product_cards": [
        {
          "product_id": "northdeco-product-1",
          "title": "Example Northdeco product",
          "url": "https://northdeco.com/products/example",
          "availability_status": "partially_out_of_stock",
          "fully_out_of_stock": false,
          "partial_stockout": true,
          "functional_stockout": false,
          "pattern_scope": "mixed",
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Variant availability is directly observable."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "northdeco-product-1"
            }
          ],
          "variant_availability": [
            {
              "variant_id": "northdeco-variant-unavailable-1",
              "product_id": "northdeco-product-1",
              "option_name": "Color",
              "option_value": "Nogal",
              "normalized_option": "nogal",
              "normalized_size": null,
              "size_role": "not_applicable",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability comes from persisted Shopify variant facts."
              },
              "source_refs": [
                {
                  "table": "shopify_variants",
                  "id": "northdeco-variant-unavailable-1"
                }
              ]
            }
          ]
        }
      ],
      "size_roles": {
        "core": [],
        "peripheral": [],
        "unknown": [],
        "not_applicable": [
          "nogal",
          "roble",
          "negro"
        ]
      },
      "pattern_scope": "mixed"
    },
    "debug": {
      "input_layer": "velz-shopify-signals persisted facts only"
    }
  },
  "test-ready-token": {
    "version": "inventory_lead_magnet_payload_v1",
    "status": "degraded",
    "tool_key": "stockout_leak_score",
    "brand": {
      "id": "92e18414-055b-4a05-a6f6-5303ee918f9b",
      "name": "Northdeco",
      "domain": "northdeco.com",
      "website_url": "https://northdeco.com"
    },
    "generated_at": "2026-08-05T06:45:00Z",
    "data_freshness": {
      "catalog_scraped_at": "2026-08-05T05:50:00Z",
      "analysis_generated_at": "2026-08-05T05:55:00Z"
    },
    "summary_metrics": {
      "product_count": 405,
      "variant_count": 467,
      "fully_out_of_stock_count": 0,
      "partial_stockout_count": 42,
      "functional_stockout_count": 18,
      "variant_stockout_pct": 13.81,
      "pattern_scope": "mixed",
      "size_curve_applicable": false,
      "sample_size": 467,
      "sample_limitations": [
        "Primary Shopify option values look like colors/materials rather than apparel sizes, so size-curve claims must degrade to variant availability language."
      ]
    },
    "sections": [
      {
        "id": "variant_availability",
        "title": "Variant availability is uneven, but not a true size curve",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Public variant availability is observable in Shopify catalog data."
        },
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "northdeco-analysis-latest",
            "field": "variant_stockout_pct"
          },
          {
            "table": "shopify_signal_items",
            "id": "northdeco-stockout-item-1"
          }
        ],
        "cards": [
          {
            "id": "variant-stockout-pct",
            "title": "13.81% of observed variants were unavailable",
            "body": "This is a catalog availability fact. Because the option set is mostly colors/materials, the payload flags the size-curve interpretation as degraded.",
            "claim_safety": {
              "level": "hard_fact",
              "visibility": "public",
              "rationale": "Computed directly from persisted Shopify variant availability."
            },
            "source_refs": [
              {
                "table": "shopify_signal_analyses",
                "id": "northdeco-analysis-latest",
                "field": "variant_stockout_pct"
              }
            ],
            "metrics": {
              "variant_stockout_pct": 13.81
            }
          },
          {
            "id": "systemic-vs-isolated",
            "title": "Availability pattern looks mixed, not a single isolated SKU",
            "body": "Several products contain unavailable options, but the sample should not be presented as a definitive lost-sales estimate.",
            "claim_safety": {
              "level": "proxy",
              "visibility": "public",
              "rationale": "Systemic-vs-isolated is an assembler inference from multiple public availability records."
            },
            "source_refs": [
              {
                "table": "shopify_signal_items",
                "id": "northdeco-stockout-item-1"
              }
            ],
            "metrics": {
              "pattern_scope": "mixed"
            }
          }
        ]
      }
    ],
    "evidence_items": [
      {
        "id": "northdeco-product-variant-sample",
        "title": "Example product with unavailable options",
        "body": "At least one persisted product/variant sample contains unavailable options in the public catalog snapshot.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Backed by shopify_signal_items and variant source refs."
        },
        "source_refs": [
          {
            "table": "shopify_signal_items",
            "id": "northdeco-stockout-item-1"
          },
          {
            "table": "shopify_variants",
            "id": "northdeco-variant-unavailable-1"
          }
        ],
        "metrics": {
          "available": false
        }
      }
    ],
    "charts": {
      "availability_by_option": {
        "type": "bar",
        "x": "normalized_option",
        "y": "unavailable_variant_count"
      }
    },
    "public_limitations": [
      {
        "code": "size_curve_not_applicable",
        "message": "The detected options behave like colors/materials, so this report avoids apparel size-curve claims and shows variant availability instead.",
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "northdeco-analysis-latest",
            "field": "data_quality_warnings"
          }
        ]
      }
    ],
    "internal_warnings": [
      {
        "code": "option_semantics_ambiguous",
        "message": "Do not render core/peripheral size language for northdeco.com without manual review.",
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "northdeco-analysis-latest"
          }
        ],
        "debug_context": {
          "detected_option_examples": [
            "nogal",
            "roble",
            "negro"
          ]
        }
      }
    ],
    "source_refs": [
      {
        "table": "brands",
        "id": "92e18414-055b-4a05-a6f6-5303ee918f9b"
      },
      {
        "table": "shopify_catalog_scrapes",
        "id": "northdeco-catalog-latest"
      },
      {
        "table": "shopify_signal_analyses",
        "id": "northdeco-analysis-latest"
      },
      {
        "table": "shopify_signal_items",
        "id": "northdeco-stockout-item-1"
      }
    ],
    "stockout": {
      "product_cards": [
        {
          "product_id": "northdeco-product-1",
          "title": "Example Northdeco product",
          "url": "https://northdeco.com/products/example",
          "availability_status": "partially_out_of_stock",
          "fully_out_of_stock": false,
          "partial_stockout": true,
          "functional_stockout": false,
          "pattern_scope": "mixed",
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Variant availability is directly observable."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "northdeco-product-1"
            }
          ],
          "variant_availability": [
            {
              "variant_id": "northdeco-variant-unavailable-1",
              "product_id": "northdeco-product-1",
              "option_name": "Color",
              "option_value": "Nogal",
              "normalized_option": "nogal",
              "normalized_size": null,
              "size_role": "not_applicable",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability comes from persisted Shopify variant facts."
              },
              "source_refs": [
                {
                  "table": "shopify_variants",
                  "id": "northdeco-variant-unavailable-1"
                }
              ]
            }
          ]
        }
      ],
      "size_roles": {
        "core": [],
        "peripheral": [],
        "unknown": [],
        "not_applicable": [
          "nogal",
          "roble",
          "negro"
        ]
      },
      "pattern_scope": "mixed"
    },
    "debug": {
      "input_layer": "velz-shopify-signals persisted facts only"
    }
  },
  "test-discount-token": {
    "version": "inventory_lead_magnet_payload_v1",
    "status": "ready",
    "tool_key": "discount_depth_analyzer",
    "brand": {
      "id": "11dcb1c4-069b-400a-b025-6fb1a7087bd5",
      "name": "Susmies",
      "domain": "susmies.com",
      "website_url": "https://susmies.com"
    },
    "generated_at": "2026-08-05T06:45:00Z",
    "data_freshness": {
      "catalog_scraped_at": "2026-08-05T05:45:00Z",
      "analysis_generated_at": "2026-08-05T05:55:00Z"
    },
    "summary_metrics": {
      "catalog_product_count": 329,
      "discounted_product_count": 260,
      "discounted_products_pct": 79.03,
      "average_discount_pct": 34.2,
      "min_discount_pct": 10.0,
      "max_discount_pct": 60.0,
      "deep_discount_product_count": 27,
      "discounted_and_available_count": 241
    },
    "sections": [
      {
        "id": "discount_depth_overview",
        "title": "Discount depth distribution",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Discount percentages are calculated from public price and compare_at_price values."
        },
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "susmies-analysis-latest",
            "field": "discounted_products_pct"
          }
        ],
        "cards": [
          {
            "id": "discounted-catalog-share",
            "title": "79.03% of catalog products show an active discount",
            "body": "The assembler computed this from persisted product pricing facts.",
            "claim_safety": {
              "level": "hard_fact",
              "visibility": "public",
              "rationale": "Backed by public Shopify price and compare_at_price fields."
            },
            "source_refs": [
              {
                "table": "shopify_signal_analyses",
                "id": "susmies-analysis-latest",
                "field": "discounted_products_pct"
              }
            ],
            "metrics": {
              "discounted_products_pct": 79.03
            }
          },
          {
            "id": "dead-stock-proxy",
            "title": "Deep discounts can be prioritized for merchandising review",
            "body": "A product still available with a high discount can be a useful proxy for stale inventory, but it is not proof that stock is not moving.",
            "claim_safety": {
              "level": "proxy",
              "visibility": "public",
              "rationale": "Staleness is inferred from discount depth and availability; sales velocity is not present in public Shopify facts."
            },
            "source_refs": [
              {
                "table": "shopify_signal_items",
                "id": "susmies-discount-item-1"
              }
            ],
            "metrics": {
              "deep_discount_product_count": 27
            }
          }
        ]
      }
    ],
    "evidence_items": [
      {
        "id": "susmies-deep-discount-product",
        "title": "Example available product with a deep discount",
        "body": "This card can say the product is available and discounted, but must keep the compare_at_price anchor caveat visible.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Availability and discount are directly observed fields."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "susmies-product-deep-1"
          },
          {
            "table": "shopify_signal_items",
            "id": "susmies-discount-item-1"
          }
        ],
        "metrics": {
          "discount_pct": 60.0,
          "available": true
        }
      }
    ],
    "charts": {
      "discount_buckets": {
        "type": "donut",
        "buckets": [
          "superficial",
          "medium",
          "deep"
        ]
      },
      "age_cohorts": {
        "type": "bar",
        "buckets": [
          "lt_30_days",
          "one_to_three_months",
          "three_to_six_months",
          "six_to_twelve_months",
          "gt_12_months"
        ]
      }
    },
    "public_limitations": [
      {
        "code": "compare_at_price_anchor",
        "message": "Discount depth uses Shopify compare_at_price as the anchor price; this is a public catalog field, not proof of historical selling price or margin impact.",
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "susmies-product-deep-1",
            "field": "compare_at_price"
          }
        ]
      }
    ],
    "internal_warnings": [
      {
        "code": "no_sales_velocity",
        "message": "Do not claim lost revenue or dead stock cash without sales velocity / inventory quantity evidence.",
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "susmies-analysis-latest"
          }
        ],
        "debug_context": {
          "blocked_claim_examples": [
            "Pierdes X €",
            "cash trapped in inventory"
          ]
        }
      }
    ],
    "source_refs": [
      {
        "table": "brands",
        "id": "11dcb1c4-069b-400a-b025-6fb1a7087bd5"
      },
      {
        "table": "shopify_catalog_scrapes",
        "id": "susmies-catalog-latest"
      },
      {
        "table": "shopify_signal_analyses",
        "id": "susmies-analysis-latest"
      },
      {
        "table": "shopify_signal_items",
        "id": "susmies-discount-item-1"
      }
    ],
    "discount_depth": {
      "buckets": [
        {
          "key": "superficial",
          "label": "Superficial (<25%)",
          "min_pct_inclusive": 0,
          "max_pct_exclusive": 25,
          "product_count": 98,
          "available_product_count": 93,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "medium",
          "label": "Medium (25-40%)",
          "min_pct_inclusive": 25,
          "max_pct_exclusive": 40,
          "product_count": 135,
          "available_product_count": 121,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "deep",
          "label": "Deep (>=40%)",
          "min_pct_inclusive": 40,
          "max_pct_exclusive": null,
          "product_count": 27,
          "available_product_count": 27,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        }
      ],
      "age_cohorts": [
        {
          "key": "lt_30_days",
          "label": "<30 days",
          "product_count": 36,
          "discounted_product_count": 21,
          "deep_discount_product_count": 2,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "one_to_three_months",
          "label": "1-3 months",
          "product_count": 88,
          "discounted_product_count": 72,
          "deep_discount_product_count": 6,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "three_to_six_months",
          "label": "3-6 months",
          "product_count": 91,
          "discounted_product_count": 74,
          "deep_discount_product_count": 9,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "six_to_twelve_months",
          "label": "6-12 months",
          "product_count": 63,
          "discounted_product_count": 54,
          "deep_discount_product_count": 7,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "gt_12_months",
          "label": ">12 months",
          "product_count": 51,
          "discounted_product_count": 39,
          "deep_discount_product_count": 3,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        }
      ],
      "deep_discount_products": [
        {
          "product_id": "susmies-product-deep-1",
          "title": "Example Susmies product",
          "url": "https://susmies.com/products/example",
          "price": 24.0,
          "compare_at_price": 60.0,
          "discount_pct": 60.0,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "six_to_twelve_months",
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Price, compare_at_price and availability are observed catalog fields."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "susmies-product-deep-1"
            }
          ]
        }
      ],
      "discounted_available_product_count": 241,
      "compare_at_price_caveat_required": true
    },
    "debug": {
      "input_layer": "velz-shopify-signals persisted facts only"
    }
  },
  "test-degraded-token": {
    "version": "inventory_lead_magnet_payload_v1",
    "status": "degraded",
    "tool_key": "discount_depth_analyzer",
    "brand": {
      "id": "11dcb1c4-069b-400a-b025-6fb1a7087bd5",
      "name": "Susmies",
      "domain": "susmies.com",
      "website_url": "https://susmies.com"
    },
    "generated_at": "2026-08-05T06:45:00Z",
    "data_freshness": {
      "catalog_scraped_at": "2026-08-05T05:45:00Z",
      "analysis_generated_at": "2026-08-05T05:55:00Z"
    },
    "summary_metrics": {
      "catalog_product_count": 329,
      "discounted_product_count": 260,
      "discounted_products_pct": 79.03,
      "average_discount_pct": 34.2,
      "min_discount_pct": 10.0,
      "max_discount_pct": 60.0,
      "deep_discount_product_count": 27,
      "discounted_and_available_count": 241
    },
    "sections": [
      {
        "id": "discount_depth_overview",
        "title": "Discount depth distribution",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Discount percentages are calculated from public price and compare_at_price values."
        },
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "susmies-analysis-latest",
            "field": "discounted_products_pct"
          }
        ],
        "cards": [
          {
            "id": "discounted-catalog-share",
            "title": "79.03% of catalog products show an active discount",
            "body": "The assembler computed this from persisted product pricing facts.",
            "claim_safety": {
              "level": "hard_fact",
              "visibility": "public",
              "rationale": "Backed by public Shopify price and compare_at_price fields."
            },
            "source_refs": [
              {
                "table": "shopify_signal_analyses",
                "id": "susmies-analysis-latest",
                "field": "discounted_products_pct"
              }
            ],
            "metrics": {
              "discounted_products_pct": 79.03
            }
          },
          {
            "id": "dead-stock-proxy",
            "title": "Deep discounts can be prioritized for merchandising review",
            "body": "A product still available with a high discount can be a useful proxy for stale inventory, but it is not proof that stock is not moving.",
            "claim_safety": {
              "level": "proxy",
              "visibility": "public",
              "rationale": "Staleness is inferred from discount depth and availability; sales velocity is not present in public Shopify facts."
            },
            "source_refs": [
              {
                "table": "shopify_signal_items",
                "id": "susmies-discount-item-1"
              }
            ],
            "metrics": {
              "deep_discount_product_count": 27
            }
          }
        ]
      }
    ],
    "evidence_items": [
      {
        "id": "susmies-deep-discount-product",
        "title": "Example available product with a deep discount",
        "body": "This card can say the product is available and discounted, but must keep the compare_at_price anchor caveat visible.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Availability and discount are directly observed fields."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "susmies-product-deep-1"
          },
          {
            "table": "shopify_signal_items",
            "id": "susmies-discount-item-1"
          }
        ],
        "metrics": {
          "discount_pct": 60.0,
          "available": true
        }
      }
    ],
    "charts": {
      "discount_buckets": {
        "type": "donut",
        "buckets": [
          "superficial",
          "medium",
          "deep"
        ]
      },
      "age_cohorts": {
        "type": "bar",
        "buckets": [
          "lt_30_days",
          "one_to_three_months",
          "three_to_six_months",
          "six_to_twelve_months",
          "gt_12_months"
        ]
      }
    },
    "public_limitations": [
      {
        "code": "compare_at_price_anchor",
        "message": "Discount depth uses Shopify compare_at_price as the anchor price; this is a public catalog field, not proof of historical selling price or margin impact.",
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "susmies-product-deep-1",
            "field": "compare_at_price"
          }
        ]
      }
    ],
    "internal_warnings": [
      {
        "code": "no_sales_velocity",
        "message": "Do not claim lost revenue or dead stock cash without sales velocity / inventory quantity evidence.",
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "susmies-analysis-latest"
          }
        ],
        "debug_context": {
          "blocked_claim_examples": [
            "Pierdes X €",
            "cash trapped in inventory"
          ]
        }
      }
    ],
    "source_refs": [
      {
        "table": "brands",
        "id": "11dcb1c4-069b-400a-b025-6fb1a7087bd5"
      },
      {
        "table": "shopify_catalog_scrapes",
        "id": "susmies-catalog-latest"
      },
      {
        "table": "shopify_signal_analyses",
        "id": "susmies-analysis-latest"
      },
      {
        "table": "shopify_signal_items",
        "id": "susmies-discount-item-1"
      }
    ],
    "discount_depth": {
      "buckets": [
        {
          "key": "superficial",
          "label": "Superficial (<25%)",
          "min_pct_inclusive": 0,
          "max_pct_exclusive": 25,
          "product_count": 98,
          "available_product_count": 93,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "medium",
          "label": "Medium (25-40%)",
          "min_pct_inclusive": 25,
          "max_pct_exclusive": 40,
          "product_count": 135,
          "available_product_count": 121,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "deep",
          "label": "Deep (>=40%)",
          "min_pct_inclusive": 40,
          "max_pct_exclusive": null,
          "product_count": 27,
          "available_product_count": 27,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        }
      ],
      "age_cohorts": [
        {
          "key": "lt_30_days",
          "label": "<30 days",
          "product_count": 36,
          "discounted_product_count": 21,
          "deep_discount_product_count": 2,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "one_to_three_months",
          "label": "1-3 months",
          "product_count": 88,
          "discounted_product_count": 72,
          "deep_discount_product_count": 6,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "three_to_six_months",
          "label": "3-6 months",
          "product_count": 91,
          "discounted_product_count": 74,
          "deep_discount_product_count": 9,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "six_to_twelve_months",
          "label": "6-12 months",
          "product_count": 63,
          "discounted_product_count": 54,
          "deep_discount_product_count": 7,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        },
        {
          "key": "gt_12_months",
          "label": ">12 months",
          "product_count": 51,
          "discounted_product_count": 39,
          "deep_discount_product_count": 3,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "susmies-analysis-latest"
            }
          ]
        }
      ],
      "deep_discount_products": [
        {
          "product_id": "susmies-product-deep-1",
          "title": "Example Susmies product",
          "url": "https://susmies.com/products/example",
          "price": 24.0,
          "compare_at_price": 60.0,
          "discount_pct": 60.0,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "six_to_twelve_months",
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Price, compare_at_price and availability are observed catalog fields."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "susmies-product-deep-1"
            }
          ]
        }
      ],
      "discounted_available_product_count": 241,
      "compare_at_price_caveat_required": true
    },
    "debug": {
      "input_layer": "velz-shopify-signals persisted facts only"
    }
  },
  "test-low-discount-token": {
    "version": "inventory_lead_magnet_payload_v1",
    "status": "ready",
    "tool_key": "discount_depth_analyzer",
    "brand": {
      "id": "127b2031-413e-488c-8ac0-827dbd59b15a",
      "name": "Mun Kombucha",
      "domain": "munkombucha.com",
      "website_url": "https://munkombucha.com"
    },
    "generated_at": "2026-08-05T06:45:00Z",
    "data_freshness": {
      "catalog_scraped_at": "2026-08-05T05:40:00Z",
      "analysis_generated_at": "2026-08-05T05:55:00Z"
    },
    "summary_metrics": {
      "catalog_product_count": 94,
      "discounted_product_count": 19,
      "discounted_products_pct": 20.21,
      "average_discount_pct": 18.0,
      "min_discount_pct": 5.0,
      "max_discount_pct": 35.0,
      "deep_discount_product_count": 0,
      "discounted_and_available_count": 18
    },
    "sections": [
      {
        "id": "discount_depth_overview",
        "title": "Discounting is present but not dominated by deep discounts",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Calculated from public catalog price fields."
        },
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "munkombucha-analysis-latest",
            "field": "discounted_products_pct"
          }
        ],
        "cards": [
          {
            "id": "discounted-catalog-share",
            "title": "20.21% of catalog products show a discount",
            "body": "The visual buckets can emphasize mostly superficial or medium discounting and avoid a dead-stock claim.",
            "claim_safety": {
              "level": "hard_fact",
              "visibility": "public",
              "rationale": "Backed by persisted Shopify price facts."
            },
            "source_refs": [
              {
                "table": "shopify_signal_analyses",
                "id": "munkombucha-analysis-latest",
                "field": "discounted_products_pct"
              }
            ],
            "metrics": {
              "discounted_products_pct": 20.21
            }
          }
        ]
      }
    ],
    "evidence_items": [
      {
        "id": "munkombucha-medium-discount-product",
        "title": "Example product with a medium discount",
        "body": "The card can show current discount depth with the compare_at_price caveat.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Price fields are directly observed."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "munkombucha-product-medium-1"
          }
        ],
        "metrics": {
          "discount_pct": 35.0,
          "available": true
        }
      }
    ],
    "charts": {
      "discount_buckets": {
        "type": "bar",
        "buckets": [
          "superficial",
          "medium",
          "deep"
        ]
      }
    },
    "public_limitations": [
      {
        "code": "compare_at_price_anchor",
        "message": "Discount depth uses Shopify compare_at_price as the anchor price; it is not proof of margin impact.",
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "munkombucha-product-medium-1",
            "field": "compare_at_price"
          }
        ]
      }
    ],
    "internal_warnings": [],
    "source_refs": [
      {
        "table": "brands",
        "id": "127b2031-413e-488c-8ac0-827dbd59b15a"
      },
      {
        "table": "shopify_catalog_scrapes",
        "id": "munkombucha-catalog-latest"
      },
      {
        "table": "shopify_signal_analyses",
        "id": "munkombucha-analysis-latest"
      }
    ],
    "discount_depth": {
      "buckets": [
        {
          "key": "superficial",
          "label": "Superficial (<25%)",
          "min_pct_inclusive": 0,
          "max_pct_exclusive": 25,
          "product_count": 13,
          "available_product_count": 12,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "munkombucha-analysis-latest"
            }
          ]
        },
        {
          "key": "medium",
          "label": "Medium (25-40%)",
          "min_pct_inclusive": 25,
          "max_pct_exclusive": 40,
          "product_count": 6,
          "available_product_count": 6,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "munkombucha-analysis-latest"
            }
          ]
        },
        {
          "key": "deep",
          "label": "Deep (>=40%)",
          "min_pct_inclusive": 40,
          "max_pct_exclusive": null,
          "product_count": 0,
          "available_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "munkombucha-analysis-latest"
            }
          ]
        }
      ],
      "age_cohorts": [
        {
          "key": "lt_30_days",
          "label": "<30 days",
          "product_count": 7,
          "discounted_product_count": 1,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "munkombucha-analysis-latest"
            }
          ]
        },
        {
          "key": "one_to_three_months",
          "label": "1-3 months",
          "product_count": 17,
          "discounted_product_count": 4,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "munkombucha-analysis-latest"
            }
          ]
        },
        {
          "key": "three_to_six_months",
          "label": "3-6 months",
          "product_count": 21,
          "discounted_product_count": 5,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "munkombucha-analysis-latest"
            }
          ]
        },
        {
          "key": "six_to_twelve_months",
          "label": "6-12 months",
          "product_count": 28,
          "discounted_product_count": 6,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "munkombucha-analysis-latest"
            }
          ]
        },
        {
          "key": "gt_12_months",
          "label": ">12 months",
          "product_count": 21,
          "discounted_product_count": 3,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "munkombucha-analysis-latest"
            }
          ]
        }
      ],
      "deep_discount_products": [],
      "discounted_available_product_count": 18,
      "compare_at_price_caveat_required": true
    },
    "debug": {
      "input_layer": "velz-shopify-signals persisted facts only"
    }
  },
  "test-not-ready-token": {
    "version": "inventory_lead_magnet_payload_v1",
    "status": "not_ready",
    "tool_key": "stockout_leak_score",
    "brand": {
      "id": "pending-brand",
      "name": "Tu marca",
      "domain": "pendiente",
      "website_url": null
    },
    "generated_at": "2026-08-05T08:45:00Z",
    "data_freshness": {
      "catalog_scraped_at": null,
      "analysis_generated_at": null
    },
    "summary_metrics": null,
    "sections": [],
    "evidence_items": [],
    "charts": {},
    "public_limitations": [
      {
        "code": "payload_pending",
        "message": "El enlace es válido, pero todavía no hay un snapshot público seguro para mostrar claims.",
        "source_refs": []
      }
    ],
    "internal_warnings": [],
    "source_refs": [
      {
        "table": "lead_magnet_payload_snapshots",
        "id": "pending-snapshot"
      }
    ],
    "stockout": null,
    "discount_depth": null,
    "debug": {
      "input_layer": "fixture only; no browser Supabase reads"
    }
  }
}));

const EXPIRED_TOKENS = new Set(["test-expired-token", "expired-token"]);
const VALID_STATUSES = new Set(["ready", "degraded", "not_ready", "manual_review_required"]);
const VALID_EVENTS = new Set(["viewed", "clicked"]);

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function getToken(event) {
  if (event.queryStringParameters?.token) {
    return event.queryStringParameters.token;
  }

  const pathMatch = event.path?.match(/\/api\/lead-magnets\/([^/?#]+)/);
  return pathMatch ? decodeURIComponent(pathMatch[1]) : "";
}

function isEventRequest(event) {
  return event.path?.includes("/events") || event.queryStringParameters?.event === "1";
}

function payloadWithToken(token, payload) {
  return {
    ...payload,
    token_suffix: token.slice(-6),
    fixture: true,
  };
}

function getPayload(token) {
  if (FIXTURE_PAYLOADS.has(token)) {
    return payloadWithToken(token, FIXTURE_PAYLOADS.get(token));
  }

  if (EXPIRED_TOKENS.has(token)) {
    return null;
  }

  return undefined;
}

async function readJsonBody(event) {
  if (!event.body) {
    return {};
  }

  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
}

export async function handler(event) {
  const token = getToken(event).trim();

  if (!token) {
    return json(400, { error: "missing_token" });
  }

  if (isEventRequest(event)) {
    if (event.httpMethod !== "POST") {
      return json(405, { error: "method_not_allowed" });
    }

    const body = await readJsonBody(event);
    const eventType = body.event_type || body.eventType;

    if (!VALID_EVENTS.has(eventType)) {
      return json(400, { error: "invalid_event_type" });
    }

    return json(202, {
      accepted: true,
      event_type: eventType,
      token_suffix: token.slice(-6),
      persisted: false,
      fixture: true,
    });
  }

  if (event.httpMethod !== "GET") {
    return json(405, { error: "method_not_allowed" });
  }

  const payload = getPayload(token);

  if (payload === null) {
    return json(410, { error: "expired_token" });
  }

  if (!payload) {
    return json(404, { error: "invalid_token" });
  }

  if (!VALID_STATUSES.has(payload.status)) {
    return json(500, { error: "invalid_fixture_status" });
  }

  return json(200, payload);
}
