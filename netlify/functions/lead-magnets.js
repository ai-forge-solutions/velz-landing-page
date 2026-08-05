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

const LIVE_EXAMPLE_TOKENS = {
  "example-susmies-discount": {
    brandId: "11dcb1c4-069b-400a-b025-6fb1a7087bd5",
    toolKey: "discount_depth_analyzer",
  },
  "example-northdeco-stockout": {
    brandId: "92e18414-055b-4a05-a6f6-5303ee918f9b",
    toolKey: "stockout_leak_score",
  },
  "example-northdeco-discount": {
    brandId: "92e18414-055b-4a05-a6f6-5303ee918f9b",
    toolKey: "discount_depth_analyzer",
  },
  "example-munkombucha-discount": {
    brandId: "127b2031-413e-488c-8ac0-827dbd59b15a",
    toolKey: "discount_depth_analyzer",
  },
};

function payloadWithToken(token, payload) {
  return {
    ...payload,
    token_suffix: token.slice(-6),
    fixture: true,
  };
}

function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    key:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY,
  };
}

function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function monthsSince(dateString) {
  if (!dateString) {
    return 14;
  }

  const ts = Date.parse(dateString);
  if (Number.isNaN(ts)) {
    return 14;
  }

  return Math.max(0, Math.round((Date.now() - ts) / (1000 * 60 * 60 * 24 * 30.4375)));
}

function ageCohortFromMonths(months) {
  if (months < 1) return "lt_30_days";
  if (months < 3) return "one_to_three_months";
  if (months < 6) return "three_to_six_months";
  if (months < 12) return "six_to_twelve_months";
  return "gt_12_months";
}

function deepBucket(product) {
  const discount = toNumber(product.max_discount_pct || product.discount_pct);
  if (discount >= 40) return "deep";
  if (discount >= 25) return "medium";
  return "superficial";
}

async function supabaseFetch(path) {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    throw new Error("missing_supabase_env");
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      accept: "application/json",
    },
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`supabase_${response.status}_${body.slice(0, 160)}`);
  }

  return JSON.parse(body);
}

async function loadLiveExampleData({ brandId }) {
  const brandRows = await supabaseFetch(
    `brands?select=id,name,domain,website_url&id=eq.${encodeURIComponent(brandId)}&limit=1`,
  );
  const brand = brandRows[0];
  if (!brand) {
    return null;
  }

  const analysisRows = await supabaseFetch(
    `shopify_signal_analyses?select=*&brand_id=eq.${encodeURIComponent(brandId)}&order=generated_at.desc.nullslast&limit=1`,
  );
  const analysis = analysisRows[0];
  if (!analysis) {
    return { brand, analysis: null, products: [], items: [] };
  }

  const catalogId = analysis.catalog_scrape_id;
  const products = await supabaseFetch(
    `shopify_products?select=id,title,product_url,featured_image_url,total_variants,available_variants,oos_variants,fully_out_of_stock,partially_out_of_stock,min_price,max_price,min_compare_at_price,max_compare_at_price,max_discount_pct,avg_discount_pct,has_discount,created_at_shopify&brand_id=eq.${encodeURIComponent(brandId)}&catalog_scrape_id=eq.${encodeURIComponent(catalogId)}&order=max_discount_pct.desc.nullslast,oos_variants.desc&limit=24`,
  );
  const items = await supabaseFetch(
    `shopify_signal_items?select=id,signal_type,claim_safety,product_title,product_url,image_url,metric_label,metric_value,price,compare_at_price,discount_pct,available_variants,total_variants,oos_ratio,product_age_days,created_at&brand_id=eq.${encodeURIComponent(brandId)}&catalog_scrape_id=eq.${encodeURIComponent(catalogId)}&order=created_at.desc&limit=48`,
  );

  return { brand, analysis, products, items };
}

function buildSourceRefs(data) {
  return [
    { table: "brands", id: data.brand.id },
    data.analysis?.catalog_scrape_id ? { table: "shopify_catalog_scrapes", id: data.analysis.catalog_scrape_id } : null,
    data.analysis?.id ? { table: "shopify_signal_analyses", id: data.analysis.id } : null,
  ].filter(Boolean);
}

function buildDiscountPayload(data) {
  const { brand, analysis, products, items } = data;
  if (!analysis) return null;

  const discountedProducts = products.filter((product) => product.has_discount);
  const deepProducts = discountedProducts.filter((product) => toNumber(product.max_discount_pct) >= 40);
  const selectedProducts = (deepProducts.length ? deepProducts : discountedProducts).slice(0, 8);
  const buckets = ["superficial", "medium", "deep"].map((key) => {
    const matching = discountedProducts.filter((product) => deepBucket(product) === key);
    return {
      key,
      label: key === "superficial" ? "Superficial (<25%)" : key === "medium" ? "Medium (25-40%)" : "Deep (>=40%)",
      min_pct_inclusive: key === "superficial" ? 0 : key === "medium" ? 25 : 40,
      max_pct_exclusive: key === "superficial" ? 25 : key === "medium" ? 40 : null,
      product_count: matching.length,
      available_product_count: matching.filter((product) => toNumber(product.available_variants) > 0).length,
      source_refs: [{ table: "shopify_signal_analyses", id: analysis.id }],
    };
  });
  const cohortMap = new Map();
  discountedProducts.forEach((product) => {
    const months = monthsSince(product.created_at_shopify);
    const key = ageCohortFromMonths(months);
    const current = cohortMap.get(key) || { product_count: 0, discounted_product_count: 0, deep_discount_product_count: 0 };
    current.product_count += 1;
    current.discounted_product_count += 1;
    if (toNumber(product.max_discount_pct) >= 40) current.deep_discount_product_count += 1;
    cohortMap.set(key, current);
  });
  const cohortLabels = {
    lt_30_days: "<30 days",
    one_to_three_months: "1-3 months",
    three_to_six_months: "3-6 months",
    six_to_twelve_months: "6-12 months",
    gt_12_months: ">12 months",
  };
  const ageCohorts = Object.entries(cohortLabels).map(([key, label]) => ({
    key,
    label,
    product_count: cohortMap.get(key)?.product_count || 0,
    discounted_product_count: cohortMap.get(key)?.discounted_product_count || 0,
    deep_discount_product_count: cohortMap.get(key)?.deep_discount_product_count || 0,
    source_refs: [{ table: "shopify_signal_analyses", id: analysis.id }],
  }));
  const evidenceItems = selectedProducts.slice(0, 3).map((product) => ({
    id: product.id,
    title: product.title,
    body: `${product.title} aparece con un descuento máximo observado de ${toNumber(product.max_discount_pct).toFixed(1)}% en el catálogo público.`,
    claim_safety: { level: "hard_fact", visibility: "public", rationale: "Price and compare_at_price are public Shopify catalog fields." },
    source_refs: [{ table: "shopify_products", id: product.id }],
    public: true,
    metrics: { discount_pct: toNumber(product.max_discount_pct), available: toNumber(product.available_variants) > 0 },
  }));

  return {
    version: "inventory_lead_magnet_payload_v1",
    status: selectedProducts.length ? "ready" : "not_ready",
    tool_key: "discount_depth_analyzer",
    brand,
    generated_at: new Date().toISOString(),
    data_freshness: { catalog_scraped_at: analysis.created_at, analysis_generated_at: analysis.generated_at },
    summary_metrics: {
      catalog_product_count: products.length,
      discounted_product_count: toNumber(analysis.discounted_products_count, discountedProducts.length),
      discounted_products_pct: toNumber(analysis.discounted_products_pct),
      average_discount_pct: null,
      min_discount_pct: null,
      max_discount_pct: Math.max(0, ...discountedProducts.map((product) => toNumber(product.max_discount_pct))),
      deep_discount_product_count: deepProducts.length,
      discounted_and_available_count: discountedProducts.filter((product) => toNumber(product.available_variants) > 0).length,
    },
    sections: [],
    evidence_items: evidenceItems,
    charts: {},
    public_limitations: [
      {
        code: "compare_at_price_anchor",
        message:
          "Discount depth uses Shopify compare_at_price as the anchor price; this is a public catalog field, not proof of historical selling price or margin impact.",
        source_refs: [{ table: "shopify_signal_analyses", id: analysis.id }],
      },
    ],
    internal_warnings: [],
    source_refs: buildSourceRefs(data),
    discount_depth: {
      buckets,
      age_cohorts: ageCohorts,
      deep_discount_products: selectedProducts.map((product) => ({
        product_id: product.id,
        title: product.title,
        url: product.product_url,
        image_url: product.featured_image_url,
        price: toNumber(product.min_price, null),
        compare_at_price: toNumber(product.max_compare_at_price, null),
        discount_pct: toNumber(product.max_discount_pct),
        bucket: deepBucket(product),
        available: toNumber(product.available_variants) > 0,
        product_age_cohort: ageCohortFromMonths(monthsSince(product.created_at_shopify)),
        product_age_months: monthsSince(product.created_at_shopify),
        claim_safety: { level: "hard_fact", visibility: "public", rationale: "Public Shopify catalog product row." },
        source_refs: [{ table: "shopify_products", id: product.id }],
      })),
      discounted_available_product_count: discountedProducts.filter((product) => toNumber(product.available_variants) > 0).length,
      compare_at_price_caveat_required: true,
    },
    stockout: null,
    debug: { input_layer: "live_supabase_shopify_signals", fixture: false },
  };
}

function buildStockoutPayload(data) {
  const { brand, analysis, products, items } = data;
  if (!analysis) return null;

  const stockoutItems = items.filter((item) => ["partial_stockout", "fully_out_of_stock", "functional_stockout", "core_size_stockout"].includes(item.signal_type));
  const stockoutProducts = products.filter((product) => product.fully_out_of_stock || product.partially_out_of_stock);
  const selected = (stockoutItems.length ? stockoutItems : stockoutProducts).slice(0, 9);
  const productCards = selected.map((item, index) => {
    const product = item.product_title ? item : stockoutProducts[index] || item;
    const total = toNumber(product.total_variants, 1);
    const oos = toNumber(product.metric_value || product.oos_variants, 1);
    return {
      product_id: product.id || product.product_title || product.title,
      title: product.product_title || product.title,
      url: product.product_url,
      image_url: product.image_url || product.featured_image_url,
      availability_status:
        product.signal_type === "fully_out_of_stock" || product.fully_out_of_stock ? "fully_out_of_stock" : "partially_out_of_stock",
      fully_out_of_stock: product.signal_type === "fully_out_of_stock" || product.fully_out_of_stock || false,
      partial_stockout: product.signal_type !== "fully_out_of_stock" && !product.fully_out_of_stock,
      functional_stockout: product.signal_type === "functional_stockout",
      pattern_scope: selected.length > 1 ? "mixed" : "isolated",
      variant_availability: Array.from({ length: Math.max(1, Math.min(total, 8)) }).map((_, variantIndex) => ({
        product_id: product.id || product.product_title || product.title,
        option_name: "Opción",
        option_value: String(variantIndex + 1),
        normalized_option: String(variantIndex + 1),
        normalized_size: String(variantIndex + 1),
        size_role: "unknown",
        available: variantIndex >= oos,
        availability_status: variantIndex < oos ? "fully_out_of_stock" : "in_stock",
        claim_safety: { level: "hard_fact", visibility: "public", rationale: "Availability is public Shopify catalog snapshot data." },
        source_refs: product.id ? [{ table: product.product_title ? "shopify_signal_items" : "shopify_products", id: product.id }] : buildSourceRefs(data),
      })),
      claim_safety: { level: product.claim_safety || "hard_fact", visibility: "public", rationale: "Public Shopify availability signal." },
      source_refs: product.id ? [{ table: product.product_title ? "shopify_signal_items" : "shopify_products", id: product.id }] : buildSourceRefs(data),
    };
  });

  return {
    version: "inventory_lead_magnet_payload_v1",
    status: productCards.length ? "degraded" : "not_ready",
    tool_key: "stockout_leak_score",
    brand,
    generated_at: new Date().toISOString(),
    data_freshness: { catalog_scraped_at: analysis.created_at, analysis_generated_at: analysis.generated_at },
    summary_metrics: {
      product_count: products.length,
      variant_count: products.reduce((sum, product) => sum + toNumber(product.total_variants), 0),
      fully_out_of_stock_count: toNumber(analysis.fully_out_of_stock_count),
      partial_stockout_count: toNumber(analysis.partially_out_of_stock_count),
      functional_stockout_count: stockoutItems.filter((item) => item.signal_type === "functional_stockout").length,
      variant_stockout_pct: toNumber(analysis.variant_stockout_pct),
      pattern_scope: productCards.length > 1 ? "mixed" : "isolated",
      size_curve_applicable: Boolean(analysis.size_pattern_applicable),
      sample_size: products.reduce((sum, product) => sum + toNumber(product.total_variants), 0),
      sample_limitations: Array.isArray(analysis.data_quality_warnings) ? analysis.data_quality_warnings : [],
    },
    sections: [],
    evidence_items: productCards.slice(0, 3).map((product) => ({
      id: product.product_id,
      title: product.title,
      body: `${product.title} tiene disponibilidad incompleta en el snapshot público de Shopify.`,
      claim_safety: { level: "hard_fact", visibility: "public", rationale: "Public Shopify availability signal." },
      source_refs: product.source_refs,
      public: true,
      metrics: { availability_status: product.availability_status },
    })),
    charts: {},
    public_limitations: [
      {
        code: "public_availability_only",
        message:
          "Availability is based on public Shopify snapshot data; it does not expose inventory quantity, sales velocity or lost revenue.",
        source_refs: [{ table: "shopify_signal_analyses", id: analysis.id }],
      },
    ],
    internal_warnings: [],
    source_refs: buildSourceRefs(data),
    stockout: {
      product_cards: productCards,
      size_roles: { core: [], peripheral: [], unknown: [], not_applicable: [] },
      pattern_scope: productCards.length > 1 ? "mixed" : "isolated",
      size_curve_applicable: Boolean(analysis.size_pattern_applicable),
      sample_limitations: Array.isArray(analysis.data_quality_warnings) ? analysis.data_quality_warnings : [],
    },
    discount_depth: null,
    debug: { input_layer: "live_supabase_shopify_signals", fixture: false },
  };
}

async function getLiveExamplePayload(token) {
  const example = LIVE_EXAMPLE_TOKENS[token];
  if (!example) return undefined;

  const data = await loadLiveExampleData(example);
  if (!data || !data.analysis) return null;

  const payload = example.toolKey === "discount_depth_analyzer" ? buildDiscountPayload(data) : buildStockoutPayload(data);
  if (!payload) return null;

  return {
    ...payload,
    token_suffix: token.slice(-6),
    fixture: false,
    live_example: true,
  };
}

async function getPayload(token) {
  if (FIXTURE_PAYLOADS.has(token)) {
    return payloadWithToken(token, FIXTURE_PAYLOADS.get(token));
  }

  const liveExamplePayload = await getLiveExamplePayload(token);
  if (liveExamplePayload !== undefined) {
    return liveExamplePayload;
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

  let payload;
  try {
    payload = await getPayload(token);
  } catch (error) {
    return json(500, {
      error: "lead_magnet_payload_load_failed",
      message: error.message,
    });
  }

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
