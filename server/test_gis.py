import asyncio

from app.services.gis_service import (
    get_nearby_infrastructure
)


async def main():

    result = await get_nearby_infrastructure(
        latitude=22.356569830079334,
        longitude=88.43563966997328,
        radius=500,
    )

    print("GIS RESULT")


    print(result["counts"])

    print("\nNEARBY:")

    for item in result["nearby"][:10]:

        print(
            item["type"],
            "|",
            item["name"],
            "|",
            item["distance_m"],
            "m"
        )


asyncio.run(main())