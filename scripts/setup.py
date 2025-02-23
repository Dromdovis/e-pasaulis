from setuptools import setup, find_packages

setup(
    name="e-pasaulis-scraper",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "beautifulsoup4>=4.12.0",
        "requests>=2.31.0",
        "pocketbase>=0.10.0",
        "python-dotenv>=1.0.0",
        "aiohttp>=3.9.0",
        "asyncio>=3.4.3",
        "lxml>=4.9.0",
        "pandas>=2.1.0",
        "numpy>=1.24.0",
        "tqdm>=4.66.0",
        "colorama>=0.4.6",
        "fake-useragent>=1.4.0",
        "selenium>=4.15.0",
        "webdriver-manager>=4.0.0",
        "playwright>=1.40.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "black>=23.9.0",
            "isort>=5.12.0",
            "flake8>=6.1.0",
            "mypy>=1.5.0",
        ]
    },
    python_requires=">=3.9",
) 