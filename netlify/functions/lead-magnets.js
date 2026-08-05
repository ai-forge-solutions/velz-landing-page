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


const EXPORTED_REAL_PAYLOADS = new Map(Object.entries({
  "example-susmies-discount": {
    "version": "inventory_lead_magnet_payload_v1",
    "status": "ready",
    "tool_key": "discount_depth_analyzer",
    "brand": {
      "id": "11dcb1c4-069b-400a-b025-6fb1a7087bd5",
      "name": "susmies",
      "domain": "susmies.com",
      "website_url": "https://susmies.com"
    },
    "generated_at": "2026-08-05T09:40:48.569Z",
    "data_freshness": {
      "catalog_scraped_at": "2026-07-15T03:52:21.989151+00:00",
      "analysis_generated_at": "2026-07-15T03:52:21.87083+00:00"
    },
    "summary_metrics": {
      "catalog_product_count": 24,
      "discounted_product_count": 260,
      "discounted_products_pct": 79.03,
      "average_discount_pct": null,
      "min_discount_pct": null,
      "max_discount_pct": 66.59,
      "deep_discount_product_count": 24,
      "discounted_and_available_count": 21
    },
    "sections": [],
    "evidence_items": [
      {
        "id": "c299918d-4dc5-442a-822b-0668fa41fc0f",
        "title": "Flamingo Pop Top",
        "body": "Flamingo Pop Top aparece con un descuento máximo observado de 66.6% en el catálogo público.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Price and compare_at_price are public Shopify catalog fields."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "c299918d-4dc5-442a-822b-0668fa41fc0f"
          }
        ],
        "public": true,
        "metrics": {
          "discount_pct": 66.59,
          "available": true
        }
      },
      {
        "id": "c7e3a160-cf5a-4b02-b568-1b9c31076286",
        "title": "Tango Reversible Top/Skirt",
        "body": "Tango Reversible Top/Skirt aparece con un descuento máximo observado de 57.8% en el catálogo público.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Price and compare_at_price are public Shopify catalog fields."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "c7e3a160-cf5a-4b02-b568-1b9c31076286"
          }
        ],
        "public": true,
        "metrics": {
          "discount_pct": 57.78,
          "available": true
        }
      },
      {
        "id": "bd970b3e-3a81-45df-9f61-009a3773689b",
        "title": "Jasmine Grey Dress",
        "body": "Jasmine Grey Dress aparece con un descuento máximo observado de 53.3% en el catálogo público.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Price and compare_at_price are public Shopify catalog fields."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "bd970b3e-3a81-45df-9f61-009a3773689b"
          }
        ],
        "public": true,
        "metrics": {
          "discount_pct": 53.33,
          "available": true
        }
      }
    ],
    "charts": {},
    "public_limitations": [
      {
        "code": "compare_at_price_anchor",
        "message": "Discount depth uses Shopify compare_at_price as the anchor price; this is a public catalog field, not proof of historical selling price or margin impact.",
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "c8c39dd6-8615-4a21-a286-d58ab2066cf3"
          }
        ]
      }
    ],
    "internal_warnings": [],
    "source_refs": [
      {
        "table": "brands",
        "id": "11dcb1c4-069b-400a-b025-6fb1a7087bd5"
      },
      {
        "table": "shopify_catalog_scrapes",
        "id": "ae786851-7fbb-4108-a83d-7a13bbdf6919"
      },
      {
        "table": "shopify_signal_analyses",
        "id": "c8c39dd6-8615-4a21-a286-d58ab2066cf3"
      }
    ],
    "discount_depth": {
      "buckets": [
        {
          "key": "superficial",
          "label": "Superficial (<25%)",
          "min_pct_inclusive": 0,
          "max_pct_exclusive": 25,
          "product_count": 0,
          "available_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c8c39dd6-8615-4a21-a286-d58ab2066cf3"
            }
          ]
        },
        {
          "key": "medium",
          "label": "Medium (25-40%)",
          "min_pct_inclusive": 25,
          "max_pct_exclusive": 40,
          "product_count": 0,
          "available_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c8c39dd6-8615-4a21-a286-d58ab2066cf3"
            }
          ]
        },
        {
          "key": "deep",
          "label": "Deep (>=40%)",
          "min_pct_inclusive": 40,
          "max_pct_exclusive": null,
          "product_count": 24,
          "available_product_count": 21,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c8c39dd6-8615-4a21-a286-d58ab2066cf3"
            }
          ]
        }
      ],
      "age_cohorts": [
        {
          "key": "lt_30_days",
          "label": "<30 days",
          "product_count": 0,
          "discounted_product_count": 0,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c8c39dd6-8615-4a21-a286-d58ab2066cf3"
            }
          ]
        },
        {
          "key": "one_to_three_months",
          "label": "1-3 months",
          "product_count": 0,
          "discounted_product_count": 0,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c8c39dd6-8615-4a21-a286-d58ab2066cf3"
            }
          ]
        },
        {
          "key": "three_to_six_months",
          "label": "3-6 months",
          "product_count": 0,
          "discounted_product_count": 0,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c8c39dd6-8615-4a21-a286-d58ab2066cf3"
            }
          ]
        },
        {
          "key": "six_to_twelve_months",
          "label": "6-12 months",
          "product_count": 2,
          "discounted_product_count": 2,
          "deep_discount_product_count": 2,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c8c39dd6-8615-4a21-a286-d58ab2066cf3"
            }
          ]
        },
        {
          "key": "gt_12_months",
          "label": ">12 months",
          "product_count": 22,
          "discounted_product_count": 22,
          "deep_discount_product_count": 22,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c8c39dd6-8615-4a21-a286-d58ab2066cf3"
            }
          ]
        }
      ],
      "deep_discount_products": [
        {
          "product_id": "c299918d-4dc5-442a-822b-0668fa41fc0f",
          "title": "Flamingo Pop Top",
          "url": "https://susmies.com/products/camiseta-geometrica-4",
          "image_url": "https://cdn.shopify.com/s/files/1/0067/4037/7647/files/FLAMINGO_POP_TOP_G.jpg?v=1776785224",
          "price": 15,
          "compare_at_price": 44.9,
          "discount_pct": 66.59,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 19,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "c299918d-4dc5-442a-822b-0668fa41fc0f"
            }
          ]
        },
        {
          "product_id": "c7e3a160-cf5a-4b02-b568-1b9c31076286",
          "title": "Tango Reversible Top/Skirt",
          "url": "https://susmies.com/products/tango-reversible-top-skirt",
          "image_url": "https://cdn.shopify.com/s/files/1/0067/4037/7647/files/Frame-5_4e068216-3c60-459e-abf5-bb30eac9879d.jpg?v=1776771302",
          "price": 19,
          "compare_at_price": 45,
          "discount_pct": 57.78,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 16,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "c7e3a160-cf5a-4b02-b568-1b9c31076286"
            }
          ]
        },
        {
          "product_id": "bd970b3e-3a81-45df-9f61-009a3773689b",
          "title": "Jasmine Grey Dress",
          "url": "https://susmies.com/products/jasmine-grey-dress",
          "image_url": "https://cdn.shopify.com/s/files/1/0067/4037/7647/files/JASMINE_GREY_DRESS_G.jpg?v=1776778855",
          "price": 35,
          "compare_at_price": 75,
          "discount_pct": 53.33,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "six_to_twelve_months",
          "product_age_months": 7,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "bd970b3e-3a81-45df-9f61-009a3773689b"
            }
          ]
        },
        {
          "product_id": "dd03af5d-99b3-4465-b850-f388a35fe287",
          "title": "Polar Green Scarf",
          "url": "https://susmies.com/products/polar-green-scarf",
          "image_url": "https://cdn.shopify.com/s/files/1/0067/4037/7647/files/POLAR_GREEN_SCARF_G.jpg?v=1776784835",
          "price": 19,
          "compare_at_price": 40,
          "discount_pct": 52.5,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 13,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "dd03af5d-99b3-4465-b850-f388a35fe287"
            }
          ]
        },
        {
          "product_id": "50a38892-a56b-4ae2-bfd4-d4a6e5a5be64",
          "title": "Poppy Reversible Top",
          "url": "https://susmies.com/products/poppy-reversible-top",
          "image_url": "https://cdn.shopify.com/s/files/1/0067/4037/7647/files/Poppy_Reversible_Top-1_a0d33b28-5b9e-4de6-a4fd-d43b7daed8ce.webp?v=1758280171",
          "price": 22.5,
          "compare_at_price": 45,
          "discount_pct": 50,
          "bucket": "deep",
          "available": false,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 16,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "50a38892-a56b-4ae2-bfd4-d4a6e5a5be64"
            }
          ]
        },
        {
          "product_id": "cd1e3212-8930-4373-89fb-2921af8fc52e",
          "title": "Duality Ocean Top",
          "url": "https://susmies.com/products/duality-ocean-top",
          "image_url": "https://cdn.shopify.com/s/files/1/0067/4037/7647/files/DUALITY_OCEAN_TOP_G.jpg?v=1776785663",
          "price": 15,
          "compare_at_price": 30,
          "discount_pct": 50,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 19,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "cd1e3212-8930-4373-89fb-2921af8fc52e"
            }
          ]
        },
        {
          "product_id": "fc490d89-9e69-4381-b19e-54d280542daf",
          "title": "Duality Roses Top",
          "url": "https://susmies.com/products/duality-roses-top",
          "image_url": "https://cdn.shopify.com/s/files/1/0067/4037/7647/files/DUALITY_ROSES_TOP_G_97d107a8-43a1-43d5-9ad5-e581b3ed35b4.jpg?v=1776785995",
          "price": 15,
          "compare_at_price": 30,
          "discount_pct": 50,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 19,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "fc490d89-9e69-4381-b19e-54d280542daf"
            }
          ]
        },
        {
          "product_id": "f0afcfb1-31f4-4524-aedf-d4057d6dbdab",
          "title": "Nevada Scarf",
          "url": "https://susmies.com/products/nevada-scarf",
          "image_url": "https://cdn.shopify.com/s/files/1/0067/4037/7647/files/NEVADA_SCARF_G.jpg?v=1776787755",
          "price": 20,
          "compare_at_price": 40,
          "discount_pct": 50,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 13,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "f0afcfb1-31f4-4524-aedf-d4057d6dbdab"
            }
          ]
        }
      ],
      "discounted_available_product_count": 21,
      "compare_at_price_caveat_required": true
    },
    "stockout": null,
    "debug": {
      "input_layer": "supabase_exported_real_data",
      "fixture": false
    },
    "token_suffix": "scount",
    "fixture": false,
    "live_example": true,
    "exported_from_supabase_at": "2026-08-05T09:40:48.569Z"
  },
  "example-northdeco-stockout": {
    "version": "inventory_lead_magnet_payload_v1",
    "status": "degraded",
    "tool_key": "stockout_leak_score",
    "brand": {
      "id": "92e18414-055b-4a05-a6f6-5303ee918f9b",
      "name": "Tienda de muebles y decoración online | Outlet | Northdeco",
      "domain": "northdeco.com",
      "website_url": "https://northdeco.com"
    },
    "generated_at": "2026-08-05T09:40:48.745Z",
    "data_freshness": {
      "catalog_scraped_at": "2026-07-22T10:56:07.069384+00:00",
      "analysis_generated_at": "2026-07-22T10:56:06.991462+00:00"
    },
    "summary_metrics": {
      "product_count": 24,
      "variant_count": 48,
      "fully_out_of_stock_count": 29,
      "partial_stockout_count": 57,
      "functional_stockout_count": 0,
      "variant_stockout_pct": 13.81,
      "pattern_scope": "mixed",
      "size_curve_applicable": true,
      "sample_size": 48,
      "sample_limitations": [
        "updated_at is suspiciously uniform; it may reflect automated sync rather than merchandiser action."
      ]
    },
    "sections": [],
    "evidence_items": [
      {
        "id": "79d5cb45-dc7d-44ff-88cc-97159196512a",
        "title": "Lámpara de Techo Dixon Conor",
        "body": "Lámpara de Techo Dixon Conor tiene disponibilidad incompleta en el snapshot público de Shopify.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Public Shopify availability signal."
        },
        "source_refs": [
          {
            "table": "shopify_signal_items",
            "id": "79d5cb45-dc7d-44ff-88cc-97159196512a"
          }
        ],
        "public": true,
        "metrics": {
          "availability_status": "partially_out_of_stock"
        }
      },
      {
        "id": "ea563151-e901-410d-91f9-65d8c3e3ed86",
        "title": "Lámpara de Techo Dixon Rock",
        "body": "Lámpara de Techo Dixon Rock tiene disponibilidad incompleta en el snapshot público de Shopify.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Public Shopify availability signal."
        },
        "source_refs": [
          {
            "table": "shopify_signal_items",
            "id": "ea563151-e901-410d-91f9-65d8c3e3ed86"
          }
        ],
        "public": true,
        "metrics": {
          "availability_status": "partially_out_of_stock"
        }
      },
      {
        "id": "e8842b0f-0412-4e4c-9c71-71eb3d796994",
        "title": "Lámpara de Techo Hemisphere",
        "body": "Lámpara de Techo Hemisphere tiene disponibilidad incompleta en el snapshot público de Shopify.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Public Shopify availability signal."
        },
        "source_refs": [
          {
            "table": "shopify_signal_items",
            "id": "e8842b0f-0412-4e4c-9c71-71eb3d796994"
          }
        ],
        "public": true,
        "metrics": {
          "availability_status": "partially_out_of_stock"
        }
      }
    ],
    "charts": {},
    "public_limitations": [
      {
        "code": "public_availability_only",
        "message": "Availability is based on public Shopify snapshot data; it does not expose inventory quantity, sales velocity or lost revenue.",
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
          }
        ]
      }
    ],
    "internal_warnings": [],
    "source_refs": [
      {
        "table": "brands",
        "id": "92e18414-055b-4a05-a6f6-5303ee918f9b"
      },
      {
        "table": "shopify_catalog_scrapes",
        "id": "805c209a-d08e-471e-b217-8d0158987702"
      },
      {
        "table": "shopify_signal_analyses",
        "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
      }
    ],
    "stockout": {
      "product_cards": [
        {
          "product_id": "79d5cb45-dc7d-44ff-88cc-97159196512a",
          "title": "Lámpara de Techo Dixon Conor",
          "url": "https://northdeco.com/products/lampara-dixon-conor",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/products/lampara-dixon-conor_negro_1.png?v=1686220258",
          "availability_status": "partially_out_of_stock",
          "fully_out_of_stock": false,
          "partial_stockout": true,
          "functional_stockout": false,
          "pattern_scope": "mixed",
          "variant_availability": [
            {
              "product_id": "79d5cb45-dc7d-44ff-88cc-97159196512a",
              "option_name": "Opción",
              "option_value": "1",
              "normalized_option": "1",
              "normalized_size": "1",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "79d5cb45-dc7d-44ff-88cc-97159196512a"
                }
              ]
            },
            {
              "product_id": "79d5cb45-dc7d-44ff-88cc-97159196512a",
              "option_name": "Opción",
              "option_value": "2",
              "normalized_option": "2",
              "normalized_size": "2",
              "size_role": "unknown",
              "available": true,
              "availability_status": "in_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "79d5cb45-dc7d-44ff-88cc-97159196512a"
                }
              ]
            }
          ],
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify availability signal."
          },
          "source_refs": [
            {
              "table": "shopify_signal_items",
              "id": "79d5cb45-dc7d-44ff-88cc-97159196512a"
            }
          ]
        },
        {
          "product_id": "ea563151-e901-410d-91f9-65d8c3e3ed86",
          "title": "Lámpara de Techo Dixon Rock",
          "url": "https://northdeco.com/products/lampara-dixon-rock",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/products/lampara-dixon-rock_negro_1.png?v=1686220279",
          "availability_status": "partially_out_of_stock",
          "fully_out_of_stock": false,
          "partial_stockout": true,
          "functional_stockout": false,
          "pattern_scope": "mixed",
          "variant_availability": [
            {
              "product_id": "ea563151-e901-410d-91f9-65d8c3e3ed86",
              "option_name": "Opción",
              "option_value": "1",
              "normalized_option": "1",
              "normalized_size": "1",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "ea563151-e901-410d-91f9-65d8c3e3ed86"
                }
              ]
            },
            {
              "product_id": "ea563151-e901-410d-91f9-65d8c3e3ed86",
              "option_name": "Opción",
              "option_value": "2",
              "normalized_option": "2",
              "normalized_size": "2",
              "size_role": "unknown",
              "available": true,
              "availability_status": "in_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "ea563151-e901-410d-91f9-65d8c3e3ed86"
                }
              ]
            }
          ],
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify availability signal."
          },
          "source_refs": [
            {
              "table": "shopify_signal_items",
              "id": "ea563151-e901-410d-91f9-65d8c3e3ed86"
            }
          ]
        },
        {
          "product_id": "e8842b0f-0412-4e4c-9c71-71eb3d796994",
          "title": "Lámpara de Techo Hemisphere",
          "url": "https://northdeco.com/products/lampara-hemisphere",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/products/lampara-hemisphere_blanco_1.png?v=1686220301",
          "availability_status": "partially_out_of_stock",
          "fully_out_of_stock": false,
          "partial_stockout": true,
          "functional_stockout": false,
          "pattern_scope": "mixed",
          "variant_availability": [
            {
              "product_id": "e8842b0f-0412-4e4c-9c71-71eb3d796994",
              "option_name": "Opción",
              "option_value": "1",
              "normalized_option": "1",
              "normalized_size": "1",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "e8842b0f-0412-4e4c-9c71-71eb3d796994"
                }
              ]
            },
            {
              "product_id": "e8842b0f-0412-4e4c-9c71-71eb3d796994",
              "option_name": "Opción",
              "option_value": "2",
              "normalized_option": "2",
              "normalized_size": "2",
              "size_role": "unknown",
              "available": true,
              "availability_status": "in_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "e8842b0f-0412-4e4c-9c71-71eb3d796994"
                }
              ]
            }
          ],
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify availability signal."
          },
          "source_refs": [
            {
              "table": "shopify_signal_items",
              "id": "e8842b0f-0412-4e4c-9c71-71eb3d796994"
            }
          ]
        },
        {
          "product_id": "174bf403-d5ea-4910-9785-1d804ce0c3f8",
          "title": "Lámpara de Techo Sixties",
          "url": "https://northdeco.com/products/lampara-de-techo-sixties",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/products/9009S-colores.png?v=1686222638",
          "availability_status": "partially_out_of_stock",
          "fully_out_of_stock": false,
          "partial_stockout": true,
          "functional_stockout": false,
          "pattern_scope": "mixed",
          "variant_availability": [
            {
              "product_id": "174bf403-d5ea-4910-9785-1d804ce0c3f8",
              "option_name": "Opción",
              "option_value": "1",
              "normalized_option": "1",
              "normalized_size": "1",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "174bf403-d5ea-4910-9785-1d804ce0c3f8"
                }
              ]
            },
            {
              "product_id": "174bf403-d5ea-4910-9785-1d804ce0c3f8",
              "option_name": "Opción",
              "option_value": "2",
              "normalized_option": "2",
              "normalized_size": "2",
              "size_role": "unknown",
              "available": true,
              "availability_status": "in_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "174bf403-d5ea-4910-9785-1d804ce0c3f8"
                }
              ]
            },
            {
              "product_id": "174bf403-d5ea-4910-9785-1d804ce0c3f8",
              "option_name": "Opción",
              "option_value": "3",
              "normalized_option": "3",
              "normalized_size": "3",
              "size_role": "unknown",
              "available": true,
              "availability_status": "in_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "174bf403-d5ea-4910-9785-1d804ce0c3f8"
                }
              ]
            }
          ],
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify availability signal."
          },
          "source_refs": [
            {
              "table": "shopify_signal_items",
              "id": "174bf403-d5ea-4910-9785-1d804ce0c3f8"
            }
          ]
        },
        {
          "product_id": "857a56c1-1b53-429c-8f8b-e47bb9d9ff65",
          "title": "Lámpara de Techo Asteroid",
          "url": "https://northdeco.com/products/lampara-de-techo-asteroid",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/products/lampara-asteroid_plata_2.png?v=1686222913",
          "availability_status": "partially_out_of_stock",
          "fully_out_of_stock": false,
          "partial_stockout": true,
          "functional_stockout": false,
          "pattern_scope": "mixed",
          "variant_availability": [
            {
              "product_id": "857a56c1-1b53-429c-8f8b-e47bb9d9ff65",
              "option_name": "Opción",
              "option_value": "1",
              "normalized_option": "1",
              "normalized_size": "1",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "857a56c1-1b53-429c-8f8b-e47bb9d9ff65"
                }
              ]
            },
            {
              "product_id": "857a56c1-1b53-429c-8f8b-e47bb9d9ff65",
              "option_name": "Opción",
              "option_value": "2",
              "normalized_option": "2",
              "normalized_size": "2",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "857a56c1-1b53-429c-8f8b-e47bb9d9ff65"
                }
              ]
            },
            {
              "product_id": "857a56c1-1b53-429c-8f8b-e47bb9d9ff65",
              "option_name": "Opción",
              "option_value": "3",
              "normalized_option": "3",
              "normalized_size": "3",
              "size_role": "unknown",
              "available": true,
              "availability_status": "in_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "857a56c1-1b53-429c-8f8b-e47bb9d9ff65"
                }
              ]
            }
          ],
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify availability signal."
          },
          "source_refs": [
            {
              "table": "shopify_signal_items",
              "id": "857a56c1-1b53-429c-8f8b-e47bb9d9ff65"
            }
          ]
        },
        {
          "product_id": "380c514d-0079-4cb3-a519-f07e00de9cbe",
          "title": "Lámpara de Techo Tropic 32",
          "url": "https://northdeco.com/products/lampara-de-techo-tropic-32",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/products/lampara-tropic_negro_2_28b0803a-0cde-4b1f-9363-8d53babe1d10.png?v=1686223110",
          "availability_status": "partially_out_of_stock",
          "fully_out_of_stock": false,
          "partial_stockout": true,
          "functional_stockout": false,
          "pattern_scope": "mixed",
          "variant_availability": [
            {
              "product_id": "380c514d-0079-4cb3-a519-f07e00de9cbe",
              "option_name": "Opción",
              "option_value": "1",
              "normalized_option": "1",
              "normalized_size": "1",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "380c514d-0079-4cb3-a519-f07e00de9cbe"
                }
              ]
            },
            {
              "product_id": "380c514d-0079-4cb3-a519-f07e00de9cbe",
              "option_name": "Opción",
              "option_value": "2",
              "normalized_option": "2",
              "normalized_size": "2",
              "size_role": "unknown",
              "available": true,
              "availability_status": "in_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "380c514d-0079-4cb3-a519-f07e00de9cbe"
                }
              ]
            }
          ],
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify availability signal."
          },
          "source_refs": [
            {
              "table": "shopify_signal_items",
              "id": "380c514d-0079-4cb3-a519-f07e00de9cbe"
            }
          ]
        },
        {
          "product_id": "287e8f30-543e-446f-8370-3ccd07159f86",
          "title": "Silla Oficina Ergonómica de Nylon y Polipropileno Zenith",
          "url": "https://northdeco.com/products/silla-oficina-ergonomica-zenith",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/files/Silla_Zenith_ND-0182-BLACK-GINGER_01.jpg?v=1741855008",
          "availability_status": "partially_out_of_stock",
          "fully_out_of_stock": false,
          "partial_stockout": true,
          "functional_stockout": false,
          "pattern_scope": "mixed",
          "variant_availability": [
            {
              "product_id": "287e8f30-543e-446f-8370-3ccd07159f86",
              "option_name": "Opción",
              "option_value": "1",
              "normalized_option": "1",
              "normalized_size": "1",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "287e8f30-543e-446f-8370-3ccd07159f86"
                }
              ]
            },
            {
              "product_id": "287e8f30-543e-446f-8370-3ccd07159f86",
              "option_name": "Opción",
              "option_value": "2",
              "normalized_option": "2",
              "normalized_size": "2",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "287e8f30-543e-446f-8370-3ccd07159f86"
                }
              ]
            },
            {
              "product_id": "287e8f30-543e-446f-8370-3ccd07159f86",
              "option_name": "Opción",
              "option_value": "3",
              "normalized_option": "3",
              "normalized_size": "3",
              "size_role": "unknown",
              "available": true,
              "availability_status": "in_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "287e8f30-543e-446f-8370-3ccd07159f86"
                }
              ]
            },
            {
              "product_id": "287e8f30-543e-446f-8370-3ccd07159f86",
              "option_name": "Opción",
              "option_value": "4",
              "normalized_option": "4",
              "normalized_size": "4",
              "size_role": "unknown",
              "available": true,
              "availability_status": "in_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "287e8f30-543e-446f-8370-3ccd07159f86"
                }
              ]
            }
          ],
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify availability signal."
          },
          "source_refs": [
            {
              "table": "shopify_signal_items",
              "id": "287e8f30-543e-446f-8370-3ccd07159f86"
            }
          ]
        },
        {
          "product_id": "8b52b2f8-fd99-4532-9930-bc878c1b92c7",
          "title": "Silla Oficina Ergonómica de Nylon Shorti",
          "url": "https://northdeco.com/products/silla-oficina-ergonomica-shorti",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/files/Shorty_NegroNegro_01.jpg?v=1742295414",
          "availability_status": "partially_out_of_stock",
          "fully_out_of_stock": false,
          "partial_stockout": true,
          "functional_stockout": false,
          "pattern_scope": "mixed",
          "variant_availability": [
            {
              "product_id": "8b52b2f8-fd99-4532-9930-bc878c1b92c7",
              "option_name": "Opción",
              "option_value": "1",
              "normalized_option": "1",
              "normalized_size": "1",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "8b52b2f8-fd99-4532-9930-bc878c1b92c7"
                }
              ]
            },
            {
              "product_id": "8b52b2f8-fd99-4532-9930-bc878c1b92c7",
              "option_name": "Opción",
              "option_value": "2",
              "normalized_option": "2",
              "normalized_size": "2",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "8b52b2f8-fd99-4532-9930-bc878c1b92c7"
                }
              ]
            },
            {
              "product_id": "8b52b2f8-fd99-4532-9930-bc878c1b92c7",
              "option_name": "Opción",
              "option_value": "3",
              "normalized_option": "3",
              "normalized_size": "3",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "8b52b2f8-fd99-4532-9930-bc878c1b92c7"
                }
              ]
            },
            {
              "product_id": "8b52b2f8-fd99-4532-9930-bc878c1b92c7",
              "option_name": "Opción",
              "option_value": "4",
              "normalized_option": "4",
              "normalized_size": "4",
              "size_role": "unknown",
              "available": true,
              "availability_status": "in_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "8b52b2f8-fd99-4532-9930-bc878c1b92c7"
                }
              ]
            }
          ],
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify availability signal."
          },
          "source_refs": [
            {
              "table": "shopify_signal_items",
              "id": "8b52b2f8-fd99-4532-9930-bc878c1b92c7"
            }
          ]
        },
        {
          "product_id": "0731ef96-4e5a-419d-815b-22be646bb83b",
          "title": "Lámpara de Mesa Kire",
          "url": "https://northdeco.com/products/lampara-de-mesa-kire",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/products/7930_jpg.png?v=1686224942",
          "availability_status": "fully_out_of_stock",
          "fully_out_of_stock": true,
          "partial_stockout": false,
          "functional_stockout": false,
          "pattern_scope": "mixed",
          "variant_availability": [
            {
              "product_id": "0731ef96-4e5a-419d-815b-22be646bb83b",
              "option_name": "Opción",
              "option_value": "1",
              "normalized_option": "1",
              "normalized_size": "1",
              "size_role": "unknown",
              "available": false,
              "availability_status": "fully_out_of_stock",
              "claim_safety": {
                "level": "hard_fact",
                "visibility": "public",
                "rationale": "Availability is public Shopify catalog snapshot data."
              },
              "source_refs": [
                {
                  "table": "shopify_signal_items",
                  "id": "0731ef96-4e5a-419d-815b-22be646bb83b"
                }
              ]
            }
          ],
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify availability signal."
          },
          "source_refs": [
            {
              "table": "shopify_signal_items",
              "id": "0731ef96-4e5a-419d-815b-22be646bb83b"
            }
          ]
        }
      ],
      "size_roles": {
        "core": [],
        "peripheral": [],
        "unknown": [],
        "not_applicable": []
      },
      "pattern_scope": "mixed",
      "size_curve_applicable": true,
      "sample_limitations": [
        "updated_at is suspiciously uniform; it may reflect automated sync rather than merchandiser action."
      ]
    },
    "discount_depth": null,
    "debug": {
      "input_layer": "supabase_exported_real_data",
      "fixture": false
    },
    "token_suffix": "ockout",
    "fixture": false,
    "live_example": true,
    "exported_from_supabase_at": "2026-08-05T09:40:48.746Z"
  },
  "example-northdeco-discount": {
    "version": "inventory_lead_magnet_payload_v1",
    "status": "ready",
    "tool_key": "discount_depth_analyzer",
    "brand": {
      "id": "92e18414-055b-4a05-a6f6-5303ee918f9b",
      "name": "Tienda de muebles y decoración online | Outlet | Northdeco",
      "domain": "northdeco.com",
      "website_url": "https://northdeco.com"
    },
    "generated_at": "2026-08-05T09:40:48.907Z",
    "data_freshness": {
      "catalog_scraped_at": "2026-07-22T10:56:07.069384+00:00",
      "analysis_generated_at": "2026-07-22T10:56:06.991462+00:00"
    },
    "summary_metrics": {
      "catalog_product_count": 24,
      "discounted_product_count": 209,
      "discounted_products_pct": 51.6,
      "average_discount_pct": null,
      "min_discount_pct": null,
      "max_discount_pct": 69.12,
      "deep_discount_product_count": 15,
      "discounted_and_available_count": 20
    },
    "sections": [],
    "evidence_items": [
      {
        "id": "66b77e5a-2534-4ba3-b55b-ddddbdc82049",
        "title": "Lámpara de Mesa Kire",
        "body": "Lámpara de Mesa Kire aparece con un descuento máximo observado de 69.1% en el catálogo público.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Price and compare_at_price are public Shopify catalog fields."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "66b77e5a-2534-4ba3-b55b-ddddbdc82049"
          }
        ],
        "public": true,
        "metrics": {
          "discount_pct": 69.12,
          "available": false
        }
      },
      {
        "id": "0b976ba2-50ca-437d-a05c-e12e2f7c6d0a",
        "title": "Lámpara de Pared Mille - 2 Brazos Rectos",
        "body": "Lámpara de Pared Mille - 2 Brazos Rectos aparece con un descuento máximo observado de 64.4% en el catálogo público.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Price and compare_at_price are public Shopify catalog fields."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "0b976ba2-50ca-437d-a05c-e12e2f7c6d0a"
          }
        ],
        "public": true,
        "metrics": {
          "discount_pct": 64.36,
          "available": true
        }
      },
      {
        "id": "bd325b7f-27ed-48ec-8766-8962a313c2c1",
        "title": "Silla de Polipropileno con Reposabrazos Elon Arms",
        "body": "Silla de Polipropileno con Reposabrazos Elon Arms aparece con un descuento máximo observado de 61.3% en el catálogo público.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Price and compare_at_price are public Shopify catalog fields."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "bd325b7f-27ed-48ec-8766-8962a313c2c1"
          }
        ],
        "public": true,
        "metrics": {
          "discount_pct": 61.3,
          "available": true
        }
      }
    ],
    "charts": {},
    "public_limitations": [
      {
        "code": "compare_at_price_anchor",
        "message": "Discount depth uses Shopify compare_at_price as the anchor price; this is a public catalog field, not proof of historical selling price or margin impact.",
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
          }
        ]
      }
    ],
    "internal_warnings": [],
    "source_refs": [
      {
        "table": "brands",
        "id": "92e18414-055b-4a05-a6f6-5303ee918f9b"
      },
      {
        "table": "shopify_catalog_scrapes",
        "id": "805c209a-d08e-471e-b217-8d0158987702"
      },
      {
        "table": "shopify_signal_analyses",
        "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
      }
    ],
    "discount_depth": {
      "buckets": [
        {
          "key": "superficial",
          "label": "Superficial (<25%)",
          "min_pct_inclusive": 0,
          "max_pct_exclusive": 25,
          "product_count": 0,
          "available_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
            }
          ]
        },
        {
          "key": "medium",
          "label": "Medium (25-40%)",
          "min_pct_inclusive": 25,
          "max_pct_exclusive": 40,
          "product_count": 9,
          "available_product_count": 7,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
            }
          ]
        },
        {
          "key": "deep",
          "label": "Deep (>=40%)",
          "min_pct_inclusive": 40,
          "max_pct_exclusive": null,
          "product_count": 15,
          "available_product_count": 13,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
            }
          ]
        }
      ],
      "age_cohorts": [
        {
          "key": "lt_30_days",
          "label": "<30 days",
          "product_count": 0,
          "discounted_product_count": 0,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
            }
          ]
        },
        {
          "key": "one_to_three_months",
          "label": "1-3 months",
          "product_count": 1,
          "discounted_product_count": 1,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
            }
          ]
        },
        {
          "key": "three_to_six_months",
          "label": "3-6 months",
          "product_count": 0,
          "discounted_product_count": 0,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
            }
          ]
        },
        {
          "key": "six_to_twelve_months",
          "label": "6-12 months",
          "product_count": 5,
          "discounted_product_count": 5,
          "deep_discount_product_count": 2,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
            }
          ]
        },
        {
          "key": "gt_12_months",
          "label": ">12 months",
          "product_count": 18,
          "discounted_product_count": 18,
          "deep_discount_product_count": 13,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "9df2ebe1-b5db-4653-8746-881fc110310d"
            }
          ]
        }
      ],
      "deep_discount_products": [
        {
          "product_id": "66b77e5a-2534-4ba3-b55b-ddddbdc82049",
          "title": "Lámpara de Mesa Kire",
          "url": "https://northdeco.com/products/lampara-de-mesa-kire",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/products/7930_jpg.png?v=1686224942",
          "price": 105,
          "compare_at_price": 340,
          "discount_pct": 69.12,
          "bucket": "deep",
          "available": false,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 50,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "66b77e5a-2534-4ba3-b55b-ddddbdc82049"
            }
          ]
        },
        {
          "product_id": "0b976ba2-50ca-437d-a05c-e12e2f7c6d0a",
          "title": "Lámpara de Pared Mille - 2 Brazos Rectos",
          "url": "https://northdeco.com/products/serge-mouille-2-brazos-rectos",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/products/mille-pared_negro_1_5dbbf9b2-6fb3-494b-b7f4-58d704f9d73a.png?v=1686744824",
          "price": 139,
          "compare_at_price": 390,
          "discount_pct": 64.36,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 68,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "0b976ba2-50ca-437d-a05c-e12e2f7c6d0a"
            }
          ]
        },
        {
          "product_id": "bd325b7f-27ed-48ec-8766-8962a313c2c1",
          "title": "Silla de Polipropileno con Reposabrazos Elon Arms",
          "url": "https://northdeco.com/products/silla-balancin-elon-arms",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/files/4_5162f0c0-ddcf-4b39-982e-b219143484e9.jpg?v=1702990042",
          "price": 89,
          "compare_at_price": 230,
          "discount_pct": 61.3,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 37,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "bd325b7f-27ed-48ec-8766-8962a313c2c1"
            }
          ]
        },
        {
          "product_id": "d211d4f8-5738-4c8f-9d89-1ff3e233c6ac",
          "title": "Lámpara de Pie Mille - 3 Brazos",
          "url": "https://northdeco.com/products/lampara-de-pie-mille-3-brazos-1",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/products/mille-pie_negro_3_aeb6cfcc-d7e3-473e-a7cf-a17c20dd1989.png?v=1686745774",
          "price": 229,
          "compare_at_price": 490,
          "discount_pct": 53.27,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 68,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "d211d4f8-5738-4c8f-9d89-1ff3e233c6ac"
            }
          ]
        },
        {
          "product_id": "c71cdaee-1c59-4744-9aab-91513d71c64c",
          "title": "Silla de Oficina de Malla Studio",
          "url": "https://northdeco.com/products/silla-oficina-studio-mesh",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/files/Mesh_01_0003_Rellenogenerativo2.jpg?v=1705591721",
          "price": 149,
          "compare_at_price": 299,
          "discount_pct": 50.17,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 68,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "c71cdaee-1c59-4744-9aab-91513d71c64c"
            }
          ]
        },
        {
          "product_id": "cdb6a418-29cd-44c7-9f88-f57526eff981",
          "title": "Taburete de Polipropileno Maestro",
          "url": "https://northdeco.com/products/taburete-maestro",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/files/Taburete_Maestro_ND-0734-BLACK_01.jpg?v=1730889806",
          "price": 45,
          "compare_at_price": 89,
          "discount_pct": 49.44,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 32,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "cdb6a418-29cd-44c7-9f88-f57526eff981"
            }
          ]
        },
        {
          "product_id": "5b3765c8-76fc-43f0-974d-5ee2bdf800bc",
          "title": "Mesa de Comedor Redonda Extensible en Madera y Metal Maider (120-160 cm)",
          "url": "https://northdeco.com/products/mesa-de-comedor-redonda-extensible-maider-120-160-cm",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/files/Mesa_Maider_frontal_negra.jpg?v=1729842261",
          "price": 199,
          "compare_at_price": 389,
          "discount_pct": 48.84,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 22,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "5b3765c8-76fc-43f0-974d-5ee2bdf800bc"
            }
          ]
        },
        {
          "product_id": "c1eacb49-b270-438d-9d0b-8391f3eb6fb7",
          "title": "Mesa de Comedor Redonda Kala (110 cm)",
          "url": "https://northdeco.com/products/mesa-de-comedor-redonda-kala-wood",
          "image_url": "https://cdn.shopify.com/s/files/1/0520/3286/4435/files/MesaKalaND-0839-NATURAL_01.jpg?v=1729696473",
          "price": 250,
          "compare_at_price": 469,
          "discount_pct": 46.7,
          "bucket": "deep",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 22,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "c1eacb49-b270-438d-9d0b-8391f3eb6fb7"
            }
          ]
        }
      ],
      "discounted_available_product_count": 20,
      "compare_at_price_caveat_required": true
    },
    "stockout": null,
    "debug": {
      "input_layer": "supabase_exported_real_data",
      "fixture": false
    },
    "token_suffix": "scount",
    "fixture": false,
    "live_example": true,
    "exported_from_supabase_at": "2026-08-05T09:40:48.907Z"
  },
  "example-munkombucha-discount": {
    "version": "inventory_lead_magnet_payload_v1",
    "status": "ready",
    "tool_key": "discount_depth_analyzer",
    "brand": {
      "id": "127b2031-413e-488c-8ac0-827dbd59b15a",
      "name": "Comprar Kombucha | Mūn Kombucha",
      "domain": "munkombucha.com",
      "website_url": "https://munkombucha.com"
    },
    "generated_at": "2026-08-05T09:40:49.077Z",
    "data_freshness": {
      "catalog_scraped_at": "2026-07-15T06:54:55.695225+00:00",
      "analysis_generated_at": "2026-07-15T06:54:55.646323+00:00"
    },
    "summary_metrics": {
      "catalog_product_count": 24,
      "discounted_product_count": 19,
      "discounted_products_pct": 20.21,
      "average_discount_pct": null,
      "min_discount_pct": null,
      "max_discount_pct": 39.6,
      "deep_discount_product_count": 0,
      "discounted_and_available_count": 15
    },
    "sections": [],
    "evidence_items": [
      {
        "id": "d14e89cf-d49d-49b6-9970-e334a1f0c2f6",
        "title": "MISTERY BOX | -40%",
        "body": "MISTERY BOX | -40% aparece con un descuento máximo observado de 39.6% en el catálogo público.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Price and compare_at_price are public Shopify catalog fields."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "d14e89cf-d49d-49b6-9970-e334a1f0c2f6"
          }
        ],
        "public": true,
        "metrics": {
          "discount_pct": 39.6,
          "available": true
        }
      },
      {
        "id": "efd79b49-8794-4852-af7a-14114b06fa16",
        "title": "ZERO RISK |-35%",
        "body": "ZERO RISK |-35% aparece con un descuento máximo observado de 34.9% en el catálogo público.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Price and compare_at_price are public Shopify catalog fields."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "efd79b49-8794-4852-af7a-14114b06fa16"
          }
        ],
        "public": true,
        "metrics": {
          "discount_pct": 34.87,
          "available": true
        }
      },
      {
        "id": "a68fc0a8-fd47-4572-8a4f-d67379dee9a0",
        "title": "TRY Ginger Pack Addict",
        "body": "TRY Ginger Pack Addict aparece con un descuento máximo observado de 33.3% en el catálogo público.",
        "claim_safety": {
          "level": "hard_fact",
          "visibility": "public",
          "rationale": "Price and compare_at_price are public Shopify catalog fields."
        },
        "source_refs": [
          {
            "table": "shopify_products",
            "id": "a68fc0a8-fd47-4572-8a4f-d67379dee9a0"
          }
        ],
        "public": true,
        "metrics": {
          "discount_pct": 33.29,
          "available": true
        }
      }
    ],
    "charts": {},
    "public_limitations": [
      {
        "code": "compare_at_price_anchor",
        "message": "Discount depth uses Shopify compare_at_price as the anchor price; this is a public catalog field, not proof of historical selling price or margin impact.",
        "source_refs": [
          {
            "table": "shopify_signal_analyses",
            "id": "c6ffa3a0-566a-4ca9-a047-6bfac29b06a6"
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
        "id": "7e49e91c-1db0-42e0-bf94-13bfca8aa88b"
      },
      {
        "table": "shopify_signal_analyses",
        "id": "c6ffa3a0-566a-4ca9-a047-6bfac29b06a6"
      }
    ],
    "discount_depth": {
      "buckets": [
        {
          "key": "superficial",
          "label": "Superficial (<25%)",
          "min_pct_inclusive": 0,
          "max_pct_exclusive": 25,
          "product_count": 15,
          "available_product_count": 11,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c6ffa3a0-566a-4ca9-a047-6bfac29b06a6"
            }
          ]
        },
        {
          "key": "medium",
          "label": "Medium (25-40%)",
          "min_pct_inclusive": 25,
          "max_pct_exclusive": 40,
          "product_count": 4,
          "available_product_count": 4,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c6ffa3a0-566a-4ca9-a047-6bfac29b06a6"
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
              "id": "c6ffa3a0-566a-4ca9-a047-6bfac29b06a6"
            }
          ]
        }
      ],
      "age_cohorts": [
        {
          "key": "lt_30_days",
          "label": "<30 days",
          "product_count": 0,
          "discounted_product_count": 0,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c6ffa3a0-566a-4ca9-a047-6bfac29b06a6"
            }
          ]
        },
        {
          "key": "one_to_three_months",
          "label": "1-3 months",
          "product_count": 3,
          "discounted_product_count": 3,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c6ffa3a0-566a-4ca9-a047-6bfac29b06a6"
            }
          ]
        },
        {
          "key": "three_to_six_months",
          "label": "3-6 months",
          "product_count": 1,
          "discounted_product_count": 1,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c6ffa3a0-566a-4ca9-a047-6bfac29b06a6"
            }
          ]
        },
        {
          "key": "six_to_twelve_months",
          "label": "6-12 months",
          "product_count": 10,
          "discounted_product_count": 10,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c6ffa3a0-566a-4ca9-a047-6bfac29b06a6"
            }
          ]
        },
        {
          "key": "gt_12_months",
          "label": ">12 months",
          "product_count": 5,
          "discounted_product_count": 5,
          "deep_discount_product_count": 0,
          "source_refs": [
            {
              "table": "shopify_signal_analyses",
              "id": "c6ffa3a0-566a-4ca9-a047-6bfac29b06a6"
            }
          ]
        }
      ],
      "deep_discount_products": [
        {
          "product_id": "d14e89cf-d49d-49b6-9970-e334a1f0c2f6",
          "title": "MISTERY BOX | -40%",
          "url": "https://munkombucha.com/products/mistery-box",
          "image_url": "https://cdn.shopify.com/s/files/1/0811/5234/4391/files/misterybox.png?v=1758214541",
          "price": 32,
          "compare_at_price": 52.98,
          "discount_pct": 39.6,
          "bucket": "medium",
          "available": true,
          "product_age_cohort": "six_to_twelve_months",
          "product_age_months": 11,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "d14e89cf-d49d-49b6-9970-e334a1f0c2f6"
            }
          ]
        },
        {
          "product_id": "efd79b49-8794-4852-af7a-14114b06fa16",
          "title": "ZERO RISK |-35%",
          "url": "https://munkombucha.com/products/zero-risk",
          "image_url": "https://cdn.shopify.com/s/files/1/0811/5234/4391/files/DEALZERORISK.png?v=1763487483",
          "price": 56,
          "compare_at_price": 85.98,
          "discount_pct": 34.87,
          "bucket": "medium",
          "available": true,
          "product_age_cohort": "six_to_twelve_months",
          "product_age_months": 9,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "efd79b49-8794-4852-af7a-14114b06fa16"
            }
          ]
        },
        {
          "product_id": "a68fc0a8-fd47-4572-8a4f-d67379dee9a0",
          "title": "TRY Ginger Pack Addict",
          "url": "https://munkombucha.com/products/try-ginger-pack-addict",
          "image_url": "https://cdn.shopify.com/s/files/1/0811/5234/4391/files/GINGERPACKADDICT.png?v=1744476172",
          "price": 10,
          "compare_at_price": 14.99,
          "discount_pct": 33.29,
          "bucket": "medium",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 16,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "a68fc0a8-fd47-4572-8a4f-d67379dee9a0"
            }
          ]
        },
        {
          "product_id": "02f74f2b-2a69-48dd-b5cc-0c11407ca07b",
          "title": "BYE BYE SODA | 32 latas 250 ml",
          "url": "https://munkombucha.com/products/bye-bye-soda",
          "image_url": "https://cdn.shopify.com/s/files/1/0811/5234/4391/files/BYEBYESODA.png?v=1767551117",
          "price": 60,
          "compare_at_price": 80,
          "discount_pct": 25,
          "bucket": "medium",
          "available": true,
          "product_age_cohort": "six_to_twelve_months",
          "product_age_months": 7,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "02f74f2b-2a69-48dd-b5cc-0c11407ca07b"
            }
          ]
        },
        {
          "product_id": "eb7320a6-a8d0-4450-afdb-d38a2faec69b",
          "title": "HELLO CASUAL | 24 latas 330 ml",
          "url": "https://munkombucha.com/products/hello-casual",
          "image_url": "https://cdn.shopify.com/s/files/1/0811/5234/4391/files/HELLOCASUAL_003947b7-60b3-4411-a71f-19a95fdad09f.png?v=1767692460",
          "price": 56,
          "compare_at_price": 71.96,
          "discount_pct": 22.18,
          "bucket": "superficial",
          "available": true,
          "product_age_cohort": "six_to_twelve_months",
          "product_age_months": 7,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "eb7320a6-a8d0-4450-afdb-d38a2faec69b"
            }
          ]
        },
        {
          "product_id": "04d49d79-25ba-4319-8ed2-d748222caddd",
          "title": "BYE BYE BIRRA | 24 latas 330 ml",
          "url": "https://munkombucha.com/products/bye-bye-beer-botella-clone",
          "image_url": "https://cdn.shopify.com/s/files/1/0811/5234/4391/files/BYEBYEBEER330.png?v=1767550948",
          "price": 56,
          "compare_at_price": 71.96,
          "discount_pct": 22.18,
          "bucket": "superficial",
          "available": true,
          "product_age_cohort": "six_to_twelve_months",
          "product_age_months": 7,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "04d49d79-25ba-4319-8ed2-d748222caddd"
            }
          ]
        },
        {
          "product_id": "13ae0c30-4734-4764-8a68-ab304d2eba58",
          "title": "MIX COMBO 12 botellas de 250 y 4 latas de 330 ml, 14 sabores",
          "url": "https://munkombucha.com/products/mix-combo-12-botellas-de-250-y-4-latas-de-330-ml-15-sabores-1",
          "image_url": "https://cdn.shopify.com/s/files/1/0811/5234/4391/files/COMBO_CAN_MIX_X16_a84ab9cc-8af4-46a8-b71d-76c1d4fb143b.png?v=1733662057",
          "price": 40,
          "compare_at_price": 50.97,
          "discount_pct": 21.52,
          "bucket": "superficial",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 20,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "13ae0c30-4734-4764-8a68-ab304d2eba58"
            }
          ]
        },
        {
          "product_id": "658aa733-2efe-4be2-aa53-f75fef2c3501",
          "title": "CAN COMBO 16 latas de 330 ml, 8 sabores",
          "url": "https://munkombucha.com/products/can-combo-16-latas-de-330-ml-8-sabores",
          "image_url": "https://cdn.shopify.com/s/files/1/0811/5234/4391/files/CAN_COMBO_330_16.png?v=1755093526",
          "price": 40,
          "compare_at_price": 50.97,
          "discount_pct": 21.52,
          "bucket": "superficial",
          "available": true,
          "product_age_cohort": "gt_12_months",
          "product_age_months": 20,
          "claim_safety": {
            "level": "hard_fact",
            "visibility": "public",
            "rationale": "Public Shopify catalog product row."
          },
          "source_refs": [
            {
              "table": "shopify_products",
              "id": "658aa733-2efe-4be2-aa53-f75fef2c3501"
            }
          ]
        }
      ],
      "discounted_available_product_count": 15,
      "compare_at_price_caveat_required": true
    },
    "stockout": null,
    "debug": {
      "input_layer": "supabase_exported_real_data",
      "fixture": false
    },
    "token_suffix": "scount",
    "fixture": false,
    "live_example": true,
    "exported_from_supabase_at": "2026-08-05T09:40:49.077Z"
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

  try {
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
  } catch (error) {
    const exportedPayload = EXPORTED_REAL_PAYLOADS.get(token);
    if (!exportedPayload) {
      throw error;
    }

    return {
      ...exportedPayload,
      token_suffix: token.slice(-6),
      fixture: false,
      live_example: true,
      exported_real_data: true,
      supabase_live_fallback_reason: error.message,
    };
  }
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
