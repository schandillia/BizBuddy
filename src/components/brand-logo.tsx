import brand from "@/lib/constants/brand.json"

interface Brand {
  BRAND?: string
  BRAND_FIRST_PART?: string
  BRAND_LAST_PART?: string
}

const brandData: Brand = brand

export const BrandLogo: React.FC = () => {
  const isTwoPartBrand = brandData.BRAND_FIRST_PART && brandData.BRAND_LAST_PART

  return (
    <div className="flex z-40 font-semibold text-gray-700 dark:text-gray-300">
      {" "}
      {/* Changed to div */}
      {isTwoPartBrand ? (
        <>
          {brandData.BRAND_FIRST_PART}
          <span className="text-brand-600 dark:text-brand-400">
            {brandData.BRAND_LAST_PART}
          </span>
        </>
      ) : (
        brandData.BRAND
      )}
    </div>
  )
}
